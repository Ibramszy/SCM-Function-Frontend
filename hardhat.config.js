require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { ALCHEMY_HTTP_URL, ACCOUNT_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};
