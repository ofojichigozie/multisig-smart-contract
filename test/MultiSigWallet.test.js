const { getParamFromTxEvent } = require('./test-helpers');
const DataStorage = artifacts.require('DataStorage');
const MultiSigWallet = artifacts.require('MultiSigWallet');

require('chai')
    .use(require('chai-as-promised'))
        .should();

const setJsonInterface = {
    "constant": false,
    "inputs": [
    {
        "name": "_data",
        "type": "uint256"
    }
    ],
    "name": "set",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}

const encodeFunctionCall = (jsonInterface, parameters) => {
    return web3.eth.abi.encodeFunctionCall(jsonInterface, [...parameters])
}

contract('MultiSigWallet', ([minter, alice, bob, carol]) => {
    beforeEach(async () => {
        this.multiSigWallet = await MultiSigWallet.new([alice, bob], '2', {
            from: minter,
            gasLimit: 5000000,
            gasPrice: web3.utils.toWei('10', 'Gwei')
        });

        this.dataStorage = await DataStorage.new(this.multiSigWallet.address, {
            from: minter
        });
    });

    describe("DataStorage", async () => {
        it("should get current data value", async () => {
            assert.equal(
                (await this.dataStorage.get()).toString(),
                '0'
            );
        })

        it("reverts if attempt to update data value via non-multisig wallet", async () => {
            await this.dataStorage.set('55', { from: minter }).should.be.rejected;
        })
    })

    describe("MultiSigWallet", async () => {
        beforeEach(async () => {
            this.data = encodeFunctionCall(setJsonInterface, ['75'])
        });

        it("can update the data value via multisig wallet", async () => {
            let transaction01 = await this.multiSigWallet
                .submitTransaction(this.dataStorage.address,'0', this.data, { from: alice })

            let transactionId = getParamFromTxEvent(transaction01, 'transactionId', null, 'Submission')

            let transaction02 = await this.multiSigWallet
                .confirmTransaction(transactionId, { from: bob })

            let executedTransactionId = getParamFromTxEvent(transaction02, 'transactionId', null, 'Execution')

            assert.equal(transactionId.toString(), executedTransactionId.toString());

            assert.equal((await this.dataStorage.get()).toString(), '75');
        })
    })
})