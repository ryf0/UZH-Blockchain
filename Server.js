require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { ethers } = require('ethers'); // For Ethereum
const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = [  // Minimal ERC-721 ABI for updating metadata hash
    "function updateMetadataHash(uint256 tokenId, string memory hash) public"
];
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Helper: Generate SHA-256 hash
function generateHash(data) {
    const sortedData = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(sortedData).digest('hex');
}

// Route: Metadata for ERC-721 tokenURI()
app.get('/metadata/:tokenId', async (req, res) => {
    try {
        const tokenId = parseInt(req.params.tokenId);
        const project = await Project.findOne({ tokenId });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Generate hash
        const projectData = project.toObject();
        const dataHash = generateHash(projectData);

        const metadata = {
            name: project.name,
            description: "Decarbonization project with verified MRV data.",
            image: project.image,
            attributes: [
                { trait_type: "Location", value: project.location },
                { trait_type: "Reporting Period", value: project.reportingPeriod },
                { trait_type: "Emissions Avoided", value: `${project.emissionsAvoided} kg CO₂e` },
                { trait_type: "Verifier", value: project.verifier },
                { trait_type: "Last Verified", value: project.lastVerified },
                { trait_type: "Data Hash", value: dataHash }
            ]
        };

        res.json(metadata);

    } catch (err) {
        console.error("❌ API Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Watch MongoDB for changes and push hash on-chain
Project.watch().on('change', async (change) => {
    try {
        if (change.operationType === 'update' || change.operationType === 'replace') {
            const tokenId = change.documentKey._id; // MongoDB _id
            const updatedProject = await Project.findById(tokenId);
            if (!updatedProject) return;

            const projectData = updatedProject.toObject();
            const newHash = generateHash(projectData);

            console.log(`🔄 Change detected for tokenId ${updatedProject.tokenId}. New hash: ${newHash}`);

            // Push hash to smart contract
            const tx = await contract.updateMetadataHash(updatedProject.tokenId, newHash);
            console.log(`📦 On-chain transaction sent: ${tx.hash}`);
            await tx.wait();
            console.log(`✅ On-chain hash updated for tokenId ${updatedProject.tokenId}`);
        }
    } catch (err) {
        console.error("❌ On-chain sync error:", err);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 API running at http://localhost:${PORT}`);
});
