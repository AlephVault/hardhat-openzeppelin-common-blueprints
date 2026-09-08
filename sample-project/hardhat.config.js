import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatOpenZeppelinCommonBlueprints from "hardhat-openzeppelin-common-blueprints";
import {defineConfig} from "hardhat/config";

export default defineConfig({
  plugins: [
    hardhatToolboxMochaEthers,
    hardhatOpenZeppelinCommonBlueprints,
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.24",
        settings: {
          evmVersion: "cancun",
        },
      },
      production: {
        version: "0.8.24",
        settings: {
          evmVersion: "cancun",
        },
      },
    },
  },
  networks: {
    default: {
      type: "edr-simulated",
      hardfork: "cancun",
    },
    node: {
      type: "edr-simulated",
      hardfork: "cancun",
    },
  },
});
