const { constants } = require('../test/test-helpers');
const MultiSigWallet = artifacts.require("MultiSigWallet");
const DataStorage = artifacts.require("DataStorage");

module.exports = async (deployer, network, accounts) => {
  const owners = [
    accounts[1],
    accounts[2]
  ]
  
  const required = '2'

  await deployer.deploy(MultiSigWallet, owners, required)
  let multiSigWallet = await MultiSigWallet.deployed()
  await deployer.deploy(DataStorage, multiSigWallet.address)
};
