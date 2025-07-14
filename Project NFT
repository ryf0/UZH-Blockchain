// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecarbonizationNFT is ERC721URIStorage, Ownable {

    // Mapping from tokenId to metadata hash
    mapping(uint256 => string) private metadataHashes;

    constructor() ERC721("DecarbonizationNFT", "DCNFT") {}

    /**
     * @dev Mint a new NFT
     * @param tokenId The token ID
     * @param tokenURI The metadata URI
     */
    function mint(address to, uint256 tokenId, string memory tokenURI) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    /**
     * @dev Update metadata hash for a given token
     * @param tokenId The token ID
     * @param newHash The new SHA-256 hash
     */
    function updateMetadataHash(uint256 tokenId, string memory newHash) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        metadataHashes[tokenId] = newHash;
    }

    /**
     * @dev Get the metadata hash of a token
     * @param tokenId The token ID
     * @return The current metadata hash
     */
    function getMetadataHash(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return metadataHashes[tokenId];
    }
}
