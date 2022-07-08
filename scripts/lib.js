const { ethers, upgrades } = require("hardhat");

async function mine(sleepDuration) {
  if (sleepDuration) {
    await ethers.provider.send("evm_increaseTime", [sleepDuration]);
  }

  return ethers.provider.send("evm_mine");
}


async function getFactories(owner) {
  let factories = {};

  factories.EventERC1155 = await ethers.getContractFactory(
    "EventERC1155",
    owner
  );
  return factories;
}



async function localDeploy() {
    [owner] = await ethers.getSigners();

    const contracts = {};
    contracts.factories = await getFactories(owner);

    contracts.EventERC1155 = await upgrades.deployProxy(
      contracts.factories.EventERC1155,
      {
        initializer: "initialize",
        kind: "uups",
      }
    );
    
    await contracts.EventERC1155.deployed();
  


    return contracts;
}



async function getLastBlockTimestamp() {
  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);
  return block.timestamp;
}

module.exports = {
    mine,
    getFactories,
    localDeploy,
    getLastBlockTimestamp,
}