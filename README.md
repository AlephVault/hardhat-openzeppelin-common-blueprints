# hardhat-openzeppelin-common-blueprints
A hardhat plugin installing some blueprints for some OpenZeppelin-powered contracts.

# Installation
Run this command to install it from NPM:

```shell
npm install hardhat-openzeppelin-common-blueprints@^1.0.0
```

# Usage
This is a hardhat plugin, so the first thing to do is to install it in your hardhat.config.ts file:

```javascript
require("hardhat-openzeppelin-common-blueprints");
```

And that's it! Check the following command to make sure you have the new contract blueprints:

```shell
npx hardhat blueprint list
```

You should see many erc-20, erc-721 and erc-1155-related blueprints. Try them and check the code.
Provided you properly learned about OpenZeppelin's Ownable, ERC20, ERC721 and ERC1155 you'll be fine.