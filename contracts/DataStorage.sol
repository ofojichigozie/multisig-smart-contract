// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract DataStorage {

    address public multiSigWallet;

    uint256 private data;

    modifier onlyMultiSigWallet(){
        require(msg.sender == multiSigWallet, "DataStorage: Only multisig wallet can execute this");
        _;
    }

    constructor(address _multiSigWallet) public {
        multiSigWallet = _multiSigWallet;
    }

    function get() external view returns (uint256) {
        return data;
    }

    function set(uint256 _data) external onlyMultiSigWallet() {
        data = _data;
    }
}