// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {WorkToken} from "../src/WorkToken.sol";

/// @dev Deploy to Fuji (from foundry/):  npm run deploy:token
/// Reads DEPLOYER_KEY, TOKEN_NAME, TOKEN_SYMBOL from .env automatically.
contract DeployWorkToken is Script {
    function run() external returns (WorkToken token) {
        uint256 pk = vm.envUint("DEPLOYER_KEY");
        string memory name = vm.envOr("TOKEN_NAME", string("Work Token"));
        string memory symbol = vm.envOr("TOKEN_SYMBOL", string("WT"));

        vm.startBroadcast(pk);
        token = new WorkToken(name, symbol);
        vm.stopBroadcast();

        console.log("=== DEPLOYED ERC-20 ===");
        console.log("Token address (students add this to their wallets):");
        console.logAddress(address(token));
    }
}
