require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("hardhat-deploy")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/PkF7F_24ySQ1iUu-b8tH80kaPQOHtIlZ"  //this is good practice
const PRIVATE_KEY = process.env.PRIVATE_KEY || "smthng"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "smthng"
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY || "smthng"
module.exports = {
    //solidity: "0.8.18",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,   //to give etherscan some time to catch up
        },
  },

    solidity: {
      compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
    namedAccounts: {
        deployer: {
            default: 0,
            // 11155111: 1, //if we want the deployer to be 1st account on sepolia
        },
        user: {
            default: 1, //ore whatever
        },
    },
    etherscan: {
      apiKey: {
        sepolia: ETHERSCAN_API_KEY,
    },
  },
    gasReporter: {
      enabled: false,    //fale means disabled if u dont rly wanna use it rn
      outputFile: "gas-report.txt",
      noColors: true,
      currency: "USD",
      coinmarketcap: COINMARKET_API_KEY,
      token: "MATIC",
    
  },
}
