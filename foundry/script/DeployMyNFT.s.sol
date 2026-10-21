// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MyNFT} from "../src/MyNFT.sol";

/// @dev Deploy to Fuji (from foundry/):
///   forge script script/DeployMyNFT.s.sol --rpc-url fuji --broadcast --slow
///
/// Reads DEPLOYER_KEY from .env automatically (Foundry loads .env) — a FRESH BURNER
/// wallet, testnet only. Your main wallet's seed phrase NEVER goes in any file.
contract DeployMyNFT is Script {
    function run() external returns (MyNFT nft) {
        uint256 pk = vm.envUint("DEPLOYER_KEY");
        string memory name = vm.envOr("COLLECTION_NAME", string("Vibe Pioneers"));
        string memory symbol = vm.envOr("COLLECTION_SYMBOL", string("VIBE"));
        string memory baseURI = vm.envOr("BASE_TOKEN_URI", string(""));

        vm.startBroadcast(pk);
        nft = new MyNFT(name, symbol, baseURI);
        vm.stopBroadcast();

        console.log("=== DEPLOYED ===");
        console.log("Contract address (put this in app/src/config.js):");
        console.logAddress(address(nft));
    }
}
