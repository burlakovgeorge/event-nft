// hardhat.config.js
// const secrets = require('./env.json');

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");
require("dotenv/config");

require("hardhat-abi-exporter");

const forkingAccountsBalance = `50000${"0".repeat(18)}`;


let realAccounts = [
  {
    privateKey: `0x${process.env.ownerKey}`,
    balance: forkingAccountsBalance,
  },
];

module.exports = {
defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: realAccounts,
      chainId: 1337,
    },
    local: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      accounts: [
        `0x${process.env.ownerKey}`
      ],
      gasPrice: 20000000000,
      gas:30000000,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.infuraProjectRinkenbyId}`,
      accounts: [
        `0x${process.env.ownerKey}`
      ],
      gasPrice: 2000000000
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.infuraProjectMainbyId}`,
      accounts: [
        `0x${process.env.ownerKey}`
      ],
      gasPrice: 60000000000
    }

  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      mainnet: process.env.ETHSCANAPIKEY,
      rinkeby: process.env.ETHSCANAPIKEY,
      // polygonMumbai: secrets.api_key_polygon,
    },
  },
  solidity: {
    version: "0.8.9",
    docker: false,
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      },
    },
  },
  plugins: ["solidity-coverage"],
  testsTimeout: 10000000,
  // tenderly: {
  //   project: "project",
  //   username: "georgeburlakov",
  //   // forkNetwork: "901495d8-1c29-459a-9b44-3e2e09f3ac44",
  //   // privateVerification: false,
  //   // deploymentsDir: "deployments"
  // },
};