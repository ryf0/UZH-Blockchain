# 🌱 Decarbonization Blockchain API

An end-to-end solution for **tracking, verifying, and publishing MRV (Measurement, Reporting, Verification) data** from decarbonization projects to the blockchain.  

This system allows edge devices and verifiers to push data into a MongoDB database, where it is **hashed in real time**, served via an API, and synced to an **ERC-721 Smart Contract** as a verifiable trust layer.  

---

## 🏗️ System Architecture

<img width="524 height="524" alt="image" src="https://github.com/user-attachments/assets/45126a05-31d3-49c6-b445-57f982a1d23b" />


**Components:**
- **Edge Devices / Verifiers:** Upload raw MRV data.
- **MongoDB Database:** Stores project data off-chain for flexibility and scalability.
- **Express API:** Serves metadata, hashes data, and pushes updates on-chain.
- **Hashing Module:** Generates SHA-256 hashes of project data to ensure integrity.
- **ERC-721 Smart Contract:** Stores hashes as decentralized proofs of data integrity.
- **Frontend Interface:** Allows stakeholders to query live project data and verify hashes.

---

## 📦 Features

| Feature                     | Description                                        |
|-----------------------------|----------------------------------------------------|
| 🌱 Auto-hashing             | Real-time SHA-256 hashing of MRV data in MongoDB. |
| 🔗 On-chain sync            | Automatically updates ERC-721 smart contract hashes when MRV data changes. |
| 📡 API for tokenURI         | Serves OpenSea-compatible JSON metadata.          |
| 🔐 Data integrity proof     | Enables anyone to verify MRV data integrity via on-chain hashes. |
| 🌐 Marketplace integration  | Compatible with OpenSea, KlimaDAO, and other NFT platforms. |

---
