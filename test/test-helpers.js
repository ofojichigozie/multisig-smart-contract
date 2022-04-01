const constants = {
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000'
}

const getParamFromTxEvent = (transaction, paramName, contractFactory, eventName) => {
    assert.isObject(transaction)
    let logs = transaction.logs
    if(eventName != null) {
        logs = logs.filter((l) => l.event === eventName)
    }
    assert.equal(logs.length, 1, 'too many logs found!')
    let param = logs[0].args[paramName]
    if(contractFactory != null) {
        let contract = contractFactory.at(param)
        assert.isObject(contract, `getting ${paramName} failed for ${param}`)
        return contract
    } else {
        return param
    }
}

const time = {
  advanceBlock: () => {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: new Date().getTime()
      }, (err, result) => {
        if (err) { return reject(err) }

        const newBlockHash = web3.eth.getBlock('latest').hash
        return resolve(newBlockHash)
      })
    })
  },

  advanceTime: (time) => {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [time],
        id: new Date().getTime()
      }, (err, result) => {
        if (err) { return reject(err) }
        return resolve(result)
      })
    })
  },

  advanceTimeAndBlock: async function (time) {
    await this.advanceTime(time)
    await this.advanceBlock()
    return Promise.resolve(web3.eth.getBlock('latest'))
  }
}

module.exports = { constants, time, getParamFromTxEvent }