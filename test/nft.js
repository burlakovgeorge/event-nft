const { ethers, network , web3} = require('hardhat');
// const WETH = require('weth');
const { expect } = require('chai');
const { BigNumber } = require("ethers");
const { testsTimeout } = require("../hardhat.config.js");


const {
  mine,
  localDeploy,

  getLastBlockTimestamp,
} = require("../scripts/lib.js");

describe("EventERC1155 contract test", function () {

    let owner, user1, user2;
    const token0 = 0;
    const baseFolderURIHash="QmWinYKyWWRFHShCsTPtdqkHkPQHBf7XT7VTrPReXxquRc";
    const baseFilename = "lion";
    const baseExtension = ".json";
    const wrongOwner= "0x682d0A324a2c42b0b40b4f0d54cd7c0Cf06afaC3";

    beforeEach(async function () {
        this.timeout(testsTimeout);

        [owner] = await ethers.getSigners();

        cs = await localDeploy();
    
    });


    it("default and ipfs methods", async () => {
      this.timeout(testsTimeout);


      expect(await cs.EventERC1155.baseFolderURIHash()).to.equal(baseFolderURIHash);
      expect(await cs.EventERC1155.baseFilename()).to.equal(baseFilename);
      expect(await cs.EventERC1155.baseExtension()).to.equal(baseExtension);
      expect(await cs.EventERC1155.hasRole(await cs.EventERC1155.DEFAULT_ADMIN_ROLE(),owner.address)).to.equal(true);

      expect(await cs.EventERC1155.uri(token0)).to.equal(`ipfs://${baseFolderURIHash}/${baseFilename}${token0}${baseExtension}`);

      await cs.EventERC1155.setFolderURIHash(baseFilename).then((tx) => tx.wait());
      expect(await cs.EventERC1155.baseFolderURIHash()).to.equal(baseFilename);

      await cs.EventERC1155.setBaseFilename(baseExtension).then((tx) => tx.wait());;
      expect(await cs.EventERC1155.baseFilename()).to.equal(baseExtension);

      await cs.EventERC1155.setBaseExtension(baseFolderURIHash).then((tx) => tx.wait());;
      expect(await cs.EventERC1155.baseExtension()).to.equal(baseFolderURIHash);

      expect(await cs.EventERC1155.allEvents()).to.eql([["","",BigNumber.from(token0),"","0x0000000000000000000000000000000000000000",""]]);

      await cs.EventERC1155.pause();

      expect(await cs.EventERC1155.paused()).to.equal(true);

      await cs.EventERC1155.unpause();

      expect(await cs.EventERC1155.paused()).to.equal(false);


    });

    it("add event methods", async () => {
      this.timeout(testsTimeout);
      let nextEvent =1;
      await cs.EventERC1155.createEvent(wrongOwner,"1","2","3","4").then((tx) => tx.wait());
      expect(await cs.EventERC1155.events(nextEvent)).to.eql(["1","2",BigNumber.from(nextEvent),"4",wrongOwner,"3"]);

      await expect( cs.EventERC1155.addUserToEvent(
        [owner.address, wrongOwner],
        nextEvent,
        ethers.utils.solidityKeccak256(["string"],["Test"])
      )).to.be.revertedWith("Only event owner can set event minters");

      nextEvent++;

      await cs.EventERC1155.createEvent(owner.address,"4","3","2","1").then((tx) => tx.wait());

      await cs.EventERC1155.addUserToEvent(
        [owner.address, wrongOwner],
        nextEvent,
        ethers.utils.solidityKeccak256(["string"],["Test"])
      )

      expect(await cs.EventERC1155.getNftsIdsOfUser(owner.address)).to.eql([BigNumber.from(nextEvent)]);



    });

    it("upgrade contract check", async () => {
      this.timeout(testsTimeout);
      const EventERC1155v2 = await ethers.getContractFactory("EventERC1155v2");

      await expect( upgrades.upgradeProxy(
        cs.EventERC1155.address,
        EventERC1155v2
      )).to.be.revertedWith("Pausable: not paused");

  
      await cs.EventERC1155.pause();

      eventERC1155 = await upgrades.upgradeProxy(
        cs.EventERC1155.address,
        EventERC1155v2
      );

      eventERC1155


      await eventERC1155.setTest("2").then((tx) => tx.wait());;
      
      expect(await eventERC1155.testField()).to.equal("2");
      expect(await eventERC1155.name()).to.equal(await cs.EventERC1155.name());
    });

});