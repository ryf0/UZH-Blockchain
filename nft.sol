// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title DecarbonizationNFT
/// @notice ERC-721 NFT storing verifiable MRV data hashes on-chain
contract DecarbonizationNFT is ERC721URIStorage, Ownable {

    /// @notice Mapping from tokenId to SHA-256 metadata hash
    mapping(uint256 => string) private metadataHashes;

    /// @notice Emitted when a metadata hash is updated
    event MetadataHashUpdated(uint256 indexed tokenId, string newHash);

    /// @notice Deploys contract with name and symbol
    constructor() ERC721("DecarbonizationNFT", "DCNFT") {}

    /// @notice Mint a new NFT for a decarbonization project
    /// @param to Recipient address
    /// @param tokenId Unique token ID
    /// @param tokenURI URI pointing to metadata JSON (e.g., API endpoint)
    function mint(address to, uint256 tokenId, string memory tokenURI) public onlyOwner {
        require(!_exists(tokenId), "Token already exists");
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    /// @notice Update the SHA-256 metadata hash for a given token
    /// @dev Only the contract owner (API wallet) can call this
    /// @param tokenId The token ID to update
    /// @param newHash The new SHA-256 hash of the MRV data
    function updateMetadataHash(uint256 tokenId, string memory newHash) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        metadataHashes[tokenId] = newHash;
        emit MetadataHashUpdated(tokenId, newHash);
    }

    /// @notice Retrieve the stored SHA-256 metadata hash for a token
    /// @param tokenId The token ID to query
    /// @return The current SHA-256 hash
    function getMetadataHash(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return metadataHashes[tokenId];
    }
}
