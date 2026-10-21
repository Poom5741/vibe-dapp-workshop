// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "openzeppelin/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "openzeppelin/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "openzeppelin/access/Ownable.sol";

// ─────────────────────────────────────────────────────────────────────────────
// MyNFT — the workshop contract. Deploys to Avalanche Fuji (43113).
//
// Read-before-deploy ritual (60 seconds, meaning not syntax):
//   is ERC721          → inherits the standard every wallet understands
//   ERC721Enumerable   → lets apps ask "which tokens does THIS address own?"
//   MAX_SUPPLY = 100   → the rule YOU chose
//   mint()             → creates a token and assigns it to an address
//   pause()            → owner-only emergency brake
// Once deployed these rules are PERMANENT — read first, deploy second.
// ─────────────────────────────────────────────────────────────────────────────

contract MyNFT is ERC721, ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MINT_PRICE = 0.01 ether; // test AVAX on Fuji
    uint256 public constant MAX_PER_MINT = 5;

    uint256 private _nextTokenId = 1;
    bool public paused;
    string public baseTokenURI;

    event Minted(address indexed to, uint256 indexed tokenId);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        baseTokenURI = baseURI_;
    }

    function mint(address to, uint256 qty) external payable {
        require(!paused, "minting is paused");
        require(qty > 0 && qty <= MAX_PER_MINT, "bad quantity");
        require(_nextTokenId - 1 + qty <= MAX_SUPPLY, "sold out");
        require(msg.value == MINT_PRICE * qty, "exact payment required");

        for (uint256 i = 0; i < qty; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
            emit Minted(to, tokenId);
        }
    }

    function setPaused(bool value) external onlyOwner {
        paused = value;
    }

    function setBaseTokenURI(string calldata uri) external onlyOwner {
        baseTokenURI = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // OZ v5: ERC721 + ERC721Enumerable both hook these — route through super.
    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721, ERC721Enumerable) returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
