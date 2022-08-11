require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SCAN_KEY = process.env.SCAN_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: SCAN_KEY,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./frontend/artifacts"
  },
};
