// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "openzeppelin/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin/access/Ownable.sol";

// ─────────────────────────────────────────────────────────────────────────────
// WorkToken — the workshop ERC-20. Deploys to Avalanche Fuji (43113).
//
// Read-before-deploy ritual (60 seconds, meaning not syntax):
//   is ERC20        → the fungible-token standard: every unit identical
//                     (contrast ERC-721: every NFT unique)
//   faucet()        → anyone claims 100 WT, ONCE per address — a classroom
//                     gas station so every student can trade without asking
//   CAP = 1,000,000 → the rule YOU chose; after the cap, faucet runs dry
//   mint()          → owner-only top-up (the "central bank" lever — discuss
//                     why real tokens remove this)
// Once deployed these rules are PERMANENT — read first, deploy second.
// ─────────────────────────────────────────────────────────────────────────────

contract WorkToken is ERC20, Ownable {
    uint256 public constant CAP = 1_000_000 ether;
    uint256 public constant FAUCET_AMOUNT = 100 ether;

    mapping(address => bool) public claimed;

    event FaucetClaimed(address indexed to, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {}

    function faucet() external {
        require(!claimed[msg.sender], "faucet already claimed");
        require(totalSupply() + FAUCET_AMOUNT <= CAP, "cap reached");
        claimed[msg.sender] = true;
        _mint(msg.sender, FAUCET_AMOUNT);
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= CAP, "cap reached");
        _mint(to, amount);
    }
}
