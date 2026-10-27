// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract KaiaGreeter {
    uint256 totalGreetings;

    constructor() {
        console.log("Yo yo, Welcome to Kaia");
    }

    function greet() public {
        totalGreetings += 1;
        console.log(msg.sender, "says hello kaia!");
    }

    function getTotalGreetings() public view returns (uint256) {
        console.log("We have %d total waves!", totalGreetings);
        return totalGreetings;
    }
}

// 0x5FbDB2315678afecb367f032d93F642f64180aa3