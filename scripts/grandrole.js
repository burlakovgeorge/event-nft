const { ethers, network } = require('hardhat');
require("dotenv/config");


const {
  getFactories,
} = require("./lib.js");

async function main() {
  [owner] = await ethers.getSigners();
  const wrongOwner= "0x682d0A324a2c42b0b40b4f0d54cd7c0Cf06afaC3";

  const cs = {};
  cs.factories = await getFactories(owner);
  cs.EventERC1155 = await cs.factories.EventERC1155.attach(process.env.EVENTCONTRACT);

  console.log('EventERC1155 deployed to:', cs.EventERC1155.address);

  await cs.EventERC1155.createEvent(owner.address,"4","3","2","1").then((tx) => tx.wait());

  console.log('EventERC1155 deployed to:', cs.EventERC1155.address);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });