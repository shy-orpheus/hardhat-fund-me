// function deployFunc(hre) {}
// module.exports.default = deployFunc

// modeule.exports = async (hre) => {      // same thing as above
//     const { getNamedAccounts, deployments} = hre    // same as hre.getNamedAccounts    hre.deployments


const { networkConfig, developmentChains }= require("../helper-hardhat-config")
const { network, getChainId } = require("hardhat")
const { verify } = require("../Utils/verify")
//const { networks } = require("../hardhat.config")
require("dotenv").config()



module.exports = async ({ getNamedAccounts, deployments}) => {    // again same as above
    const{ deploy,log} =deployments
    const{deployer} = await getNamedAccounts()
    
    
    const chainId = network.config.chainId
    console.log(chainId)

    //if chain id is x use address y
    //if chain id is z use address q
    
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }
    else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] 
    }

    // mock idea! == if the contract does not exist, we deploy a minimal version for our local testing

    //when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe" , {
        from:deployer,
        args: args ,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(! developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, args) 
       }

    log("----------------------------------------------------")


}     

module.exports.tags = ["all","fundme"]     // can use yarn 'hardhat deploy --tags mocks/all' in terminal to run files with specific tags

//923108