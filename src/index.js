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

    new hre.methodPrompts.ContractMethodPrompt(
        "send", "mint", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: (tx) => {
                console.log("Tokens minted successfully:", tx);
            }
        }, [{
            name: "to",
            description: "The address to mint tokens to",
            message: "Who do you want to mint tokens to?",
            argumentType: "smart-address"
        }, {
            name: "amount",
            description: "The amount to mint",
            message: "What's the amount to mint?",
            argumentType: "uint256"
        }], {}
    ).asTask("erc20:owned:mint", "Invokes mint(address,uint256) on an Owned ERC-20 contract");
    new hre.methodPrompts.ContractMethodPrompt(
        "send", "safeMint(address,uint256)", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: (tx) => {
                console.log("Tokens minted successfully:", tx);
            }
        }, [{
            name: "to",
            description: "The address to mint a token to",
            message: "Who do you want to mint a token to?",
            argumentType: "smart-address"
        }, {
            name: "tokenId",
            description: "The ID of the token to mint",
            message: "What's the ID of the token to mint?",
            argumentType: "uint256"
        }], {}
    ).asTask("erc721:owned:mint", "Invokes safeMint(address,uint256) on an Owned ERC-721 contract");
    new hre.methodPrompts.ContractMethodPrompt(
        "send", "safeMint(address,uint256,bytes)", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: (tx) => {
                console.log("Tokens minted successfully:", tx);
            }
        }, [{
            name: "to",
            description: "The address to mint a token to",
            message: "Who do you want to mint a token to?",
            argumentType: "smart-address"
        }, {
            name: "tokenId",
            description: "The ID of the token to mint",
            message: "What's the ID of the token to mint?",
            argumentType: "uint256"
        }, {
            name: "data",
            description: "The data of the mint",
            message: "Enter the data for this mint",
            argumentType: "bytes"
        }], {}
    ).asTask("erc721:owned:mint-with-data", "Invokes safeMint(address,uint256,bytes) on an Owned ERC-721 contract");
    new hre.methodPrompts.ContractMethodPrompt(
        "send", "mint", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: (tx) => {
                console.log("Tokens minted successfully:", tx);
            }
        }, [{
            name: "to",
            description: "The address to mint tokens to",
            message: "Who do you want to mint tokens to?",
            argumentType: "smart-address"
        }, {
            name: "tokenId",
            description: "The ID of the token to mint",
            message: "What's the ID of the token to mint?",
            argumentType: "uint256"
        }, {
            name: "amount",
            description: "The amount of the token to mint",
            message: "What's the amount of the token to mint?",
            argumentType: "uint256"
        }, {
            name: "data",
            description: "The data of the mint",
            message: "Enter the data for this mint",
            argumentType: "bytes"
        }], {}
    ).asTask("erc1155:owned:mint", "Invokes mint(address,uint256,uint256,bytes) on an Owned ERC-1155 contract");
    new hre.methodPrompts.ContractMethodPrompt(
        "send", "mintBatch", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: (tx) => {
                console.log("Tokens minted successfully:", tx);
            }
        }, [{
            name: "to",
            description: "The address to mint tokens to",
            message: "Who do you want to mint tokens to?",
            argumentType: "smart-address"
        }, hre.blueprints.arrayArgument({
            message: "Tell the IDs of the tokens to mint",
            description: "The IDs of the tokens to mint",
            name: "tokenIds",
            elements: {
                argumentType: "uint256",
                message: "Token ID #${index}"
            }
        }), hre.blueprints.arrayArgument({
            message: "Tell the amounts of the tokens to mint",
            description: "The amounts of the tokens to mint",
            name: "amounts",
            elements: {
                argumentType: "uint256",
                message: "Token amount #${index}"
            }
        }), {
            name: "data",
            description: "The data of the mint",
            message: "Enter the data for this mint",
            argumentType: "bytes"
        }], {}
    ).asTask("erc1155:owned:mint-batch", "Invokes mintBatch(address,uint256[],uint256[],bytes) on an Owned ERC-1155 contract");
    new hre.methodPrompts.ContractMethodPrompt(
        "call", "owner", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: async (value) => {
                console.log("Owner:", value);
                const signers = await hre.common.getSigners();
                for(let index = 0; index < signers.length; index++) {
                    let address = hre.common.getAddress(signers[index]);
                    if (address.toLowerCase() === value.toLowerCase()) {
                        console.log("This address belongs to the account with index:", index);
                    }
                }
            }
        }, [], {}
    ).asTask("owned:owner", "Invokes owner() on an Ownable contract");
    new hre.methodPrompts.ContractMethodPrompt(
        "send", "transferOwnership", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: (tx) => {
                console.log("Ownership transferred successfully:", tx);
            }
        }, [{
            name: "to",
            description: "The address to transfer ownership to",
            message: "Who do you want to transfer ownership to?",
            argumentType: "smart-address"
        }], {}
    ).asTask("owned:transfer-ownership", "Invokes transferOwnership(address) on an Ownable contract");
    new hre.methodPrompts.ContractMethodPrompt(
        "send", "renounceOwnership", {
            onError: (e) => {
                console.error("There was an error while running this method");
                console.error(e);
            },
            onSuccess: (tx) => {
                console.log("Ownership renounced successfully:", tx);
            }
        }, [], {}
    ).asTask("owned:renounce-ownership", "Invokes renounceOwnership() on an Ownable contract");
});

module.exports = {}