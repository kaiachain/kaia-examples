require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");

require("@klaytn/hardhat-utils");
require('dotenv').config()

const accounts = [
  process.env.PRIVATE_KEY
];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: process.env.RPC_URL || "http://localhost:8545",
      accounts: accounts,
    },
    kairos: {
      url: process.env.RPC_URL || "https://public-en-kairos.node.kaia.io",
      accounts: accounts,
    },
    kaia: {
      url: process.env.RPC_URL || "https://public-en.node.kaia.io",
      accounts: accounts,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};
