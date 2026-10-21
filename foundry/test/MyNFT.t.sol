// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MyNFT} from "../src/MyNFT.sol";

contract MyNFTTest is Test {
    MyNFT nft;
    address alice = makeAddr("alice");

    function setUp() public {
        nft = new MyNFT("Vibe Pioneers", "VIBE", "");
    }

    function test_MintOneToken() public {
        nft.mint{value: 0.01 ether}(alice, 1);
        assertEq(nft.balanceOf(alice), 1);
        assertEq(nft.ownerOf(1), alice);
        assertEq(nft.totalSupply(), 1);
    }

    function test_MintFiveTokens() public {
        nft.mint{value: 0.05 ether}(alice, 5);
        assertEq(nft.totalSupply(), 5);
    }

    function test_RevertWhen_WrongPayment() public {
        vm.expectRevert("exact payment required");
        nft.mint{value: 0.005 ether}(alice, 1);
    }

    function test_RevertWhen_TooManyPerMint() public {
        vm.expectRevert("bad quantity");
        nft.mint{value: 0.06 ether}(alice, 6);
    }

    function test_RevertWhen_SoldOut() public {
        // mint the whole supply from a whale, then one more must revert
        address whale = makeAddr("whale");
        vm.deal(whale, 1 ether);
        vm.startPrank(whale);
        for (uint256 i = 0; i < 20; i++) nft.mint{value: 0.05 ether}(whale, 5);
        vm.stopPrank();
        vm.expectRevert("sold out");
        nft.mint{value: 0.01 ether}(alice, 1);
    }

    function test_PauseIsOwnerOnly() public {
        vm.prank(alice);
        vm.expectRevert();
        nft.setPaused(true);
        nft.setPaused(true);
        vm.expectRevert("minting is paused");
        nft.mint{value: 0.01 ether}(alice, 1);
    }

    function test_NameAndSymbol() public view {
        assertEq(nft.name(), "Vibe Pioneers");
        assertEq(nft.symbol(), "VIBE");
    }
}
