const { ethers, network } = require('hardhat')



const {
  localDeploy,
} = require("./lib.js");

async function main() {

  const cs=await localDeploy();

  console.log('EventERC1155 deployed to:', cs.EventERC1155.address);
  console.log('Enter to console for verify contract:');
  console.log(`yarn hardhat verify --network ${network.name} ${cs.EventERC1155.address}`);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });