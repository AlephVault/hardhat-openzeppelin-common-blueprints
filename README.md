# hardhat-openzeppelin-common-blueprints
A hardhat plugin installing some blueprints for some OpenZeppelin-powered contracts.

# Installation
Run this command to install it from NPM:

```shell
npm install --save-dev hardhat@^3.0.0 hardhat-common-tools@^3.0.0 hardhat-enquirer-plus@^3.0.0 hardhat-blueprints@^3.0.0 hardhat-method-prompts@^3.0.0 hardhat-openzeppelin-common-blueprints@^3.0.0
npm install @openzeppelin/contracts@^5.0.2
```

# Usage
This is a Hardhat 3 plugin. Import it in your Hardhat config and add it to the `plugins` array:

```javascript
import hardhatOpenZeppelinCommonBlueprints from "hardhat-openzeppelin-common-blueprints";
import {defineConfig} from "hardhat/config";

export default defineConfig({
  plugins: [
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
```

And that's it! Check the following command to make sure you have the new contract blueprints:

```shell
npx hardhat blueprint list
```

You should see many erc-20, erc-721 and erc-1155-related blueprints. Try them and check the code.
Provided you properly learned about OpenZeppelin's Ownable, ERC20, ERC721 and ERC1155 you'll be fine.

### New invokable methods

Check these method tasks with `--help` to have a grasp on what they do:

```shell
# Owned:
npx hardhat invoke ownable owner --help
npx hardhat invoke ownable transfer-ownership --help
npx hardhat invoke ownable renounce-ownership --help
# ERC-20:
npx hardhat invoke erc20 owned mint --help
# ERC-721:
npx hardhat invoke erc721 owned mint --help
npx hardhat invoke erc721 owned mint-with-data --help
# ERC-1155:
npx hardhat invoke erc1155 owned mint --help
npx hardhat invoke erc1155 owned mint-batch --help
```
