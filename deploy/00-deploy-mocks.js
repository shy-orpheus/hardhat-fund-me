const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    networkConfig,
} = require("../helper-hardhat-config")
const { Log } = require("ethers")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //const chainId = network.config.chainId

    if (/*chainId == 31337*/developmentChains.includes(network.name)) {
        // to see if chain id is insider developmentChains
        log("Local network detected! Deploying mocks .....")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS,INITIAL_ANSWER], // defining in helper-hardhat-config.js
        })
        log("Mocks Deployed!!")
        log("-----------------------------------------------------------")
    }
}

module.exports.tags = ["all","mocks"]      // can use yarn 'hardhat deploy --tags mocks/all' in terminal to run files with specific tags