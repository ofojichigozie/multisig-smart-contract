const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config()
const mnemonic = process.env.SEED_PHRASE;

module.exports = {
  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    bscscan: process.env.BSCSCAN_API_KEY
  },

  networks: {

    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },

    testnet: {
      provider: () => new HDWalletProvider(mnemonic, `wss://data-seed-prebsc-2-s3.binance.org:8545`),
      network_id: 97,
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: true,
      websockets: true,
      networkCheckTimeout: 999999
    },

    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `wss://bsc-ws-node.nariox.org:443`),
      network_id: 56,
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: true,
      websockets: true,
      networkCheckTimeout: 999999
    }
  },

  contracts_directory: './contracts/',
  contracts_build_directory: './builds/',

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
