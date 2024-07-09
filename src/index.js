const path = require("path");
const {extendEnvironment} = require("hardhat/config");

const baseDir = path.resolve(
    __dirname, "..", "data", "templates", "solidity"
);

extendEnvironment((hre) => {
    hre.blueprints.registerBlueprintArgumentType(
        "token-symbol", {
            type: "plus:given-or-valid-input",
            validate: /^[A-Z][A-Z]{2,}$/,
            makeInvalidInputMessage: (v) => `Invalid token symbol: ${v}`,
            onInvalidGiven: (v) => console.error(`Invalid given token symbol: ${v}`)
        }, "An uppercase (letter-starting) short symbol code"
    );
    hre.blueprints.registerBlueprintArgumentType(
        "token-name", {
            type: "plus:given-or-valid-input",
            validate: /^[ A-Za-z0-9_-]+$/,
            makeInvalidInputMessage: (v) => `Invalid token name: ${v}`,
            onInvalidGiven: (v) => console.error(`Invalid given token name: ${v}`)
        }, "A token title/name"
    );

    const solidityVersionArgument = {
        name: "SOLIDITY_VERSION",
        description: "The Solidity version for the new file",
        message: "Choose the solidity version for this file",
        argumentType: "solidity"
    };
    const tokenSymbol = {
        name: "SYMBOL",
        description: "The symbol for this token",
        message: "What's the symbol for your token?",
        argumentType: "token-symbol"
    };
    const tokenName = {
        name: "NAME",
        description: "The name for this token",
        message: "Give a name/title to your token",
        argumentType: "token-name"
    };
    const collectionSymbol = {
        name: "SYMBOL",
        description: "The symbol for this collection",
        message: "What's the symbol for your collection?",
        argumentType: "token-symbol"
    };
    const collectionName = {
        name: "NAME",
        description: "The name for this collection",
        message: "Give a name/title to your collection",
        argumentType: "token-name"
    };

    hre.blueprints.registerBlueprint(
        "oz:erc-20", "MyERC20", "An OpenZeppelin-powered ERC-20 contract file",
        path.resolve(baseDir, "ERC20.sol.template"), "solidity", [
            solidityVersionArgument, tokenSymbol, tokenName
        ]
    );
    hre.blueprints.registerBlueprint(
        "oz:owned-erc-20", "MyOwnedERC20", "An OpenZeppelin-powered Owned ERC-20 contract file",
        path.resolve(baseDir, "OwnedERC20.sol.template"), "solidity", [
            solidityVersionArgument, tokenSymbol, tokenName
        ]
    );
    hre.blueprints.registerBlueprint(
        "oz:erc-721", "MyERC721", "An OpenZeppelin-powered ERC-721 contract file",
        path.resolve(baseDir, "ERC721.sol.template"), "solidity", [
            solidityVersionArgument, collectionSymbol, collectionName
        ]
    );
    hre.blueprints.registerBlueprint(
        "oz:owned-erc-721", "MyOwnedERC721", "An OpenZeppelin-powered Owned ERC-721 contract file",
        path.resolve(baseDir, "OwnedERC721.sol.template"), "solidity", [
            solidityVersionArgument, collectionSymbol, collectionName
        ]
    );
    hre.blueprints.registerBlueprint(
        "oz:erc-1155", "MyERC1155", "An OpenZeppelin-powered ERC-1155 contract file",
        path.resolve(baseDir, "ERC1155.sol.template"), "solidity", [
            solidityVersionArgument
        ]
    );
    hre.blueprints.registerBlueprint(
        "oz:owned-erc-1155", "MyOwnedERC1155", "An OpenZeppelin-powered Owned ERC-1155 contract file",
        path.resolve(baseDir, "OwnedERC1155.sol.template"), "solidity", [
            solidityVersionArgument
        ]
    );
});

module.exports = {}