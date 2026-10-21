// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {WorkToken} from "../src/WorkToken.sol";

contract WorkTokenTest is Test {
    WorkToken token;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        token = new WorkToken("Work Token", "WT");
    }

    function test_FaucetGives100Once() public {
        vm.prank(alice);
        token.faucet();
        assertEq(token.balanceOf(alice), 100 ether);
        vm.prank(alice);
        vm.expectRevert("faucet already claimed");
        token.faucet();
    }

    function test_FaucetIsPerAddress() public {
        vm.prank(alice);
        token.faucet();
        vm.prank(bob);
        token.faucet();
        assertEq(token.balanceOf(alice), 100 ether);
        assertEq(token.balanceOf(bob), 100 ether);
        assertEq(token.totalSupply(), 200 ether);
    }

    function test_TransferBetweenStudents() public {
        vm.prank(alice);
        token.faucet();
        vm.prank(alice);
        token.transfer(bob, 40 ether);
        assertEq(token.balanceOf(alice), 60 ether);
        assertEq(token.balanceOf(bob), 40 ether);
    }

    function test_MintIsOwnerOnly() public {
        vm.prank(alice);
        vm.expectRevert();
        token.mint(alice, 1 ether);
        token.mint(alice, 500_000 ether);
        assertEq(token.totalSupply(), 500_000 ether);
    }

    function test_RevertWhen_CapReached() public {
        token.mint(address(this), 1_000_000 ether - 50 ether);
        vm.expectRevert("cap reached");
        token.faucet();
    }

    function test_NameAndSymbol() public view {
        assertEq(token.name(), "Work Token");
        assertEq(token.symbol(), "WT");
    }
}
