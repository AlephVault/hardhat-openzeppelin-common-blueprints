import {emptyTask, task} from "hardhat/config";
import {definePlugin} from "hardhat/plugins";
import {ArgumentType} from "hardhat/types/arguments";
import hardhatBlueprintsPlugin from "hardhat-blueprints";
import hardhatCommonToolsPlugin from "hardhat-common-tools";
import hardhatEnquirerPlusPlugin from "hardhat-enquirer-plus";
import hardhatMethodPromptsPlugin from "hardhat-method-prompts";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseDir = path.resolve(
    __dirname, "..", "data", "templates", "solidity"
);

const txOptionArgumentSpecs = {
    account: "The account index or address to use as sender",
    value: "The native token value to send",
    gas: "The gas limit to use",
    gasPrice: "The legacy gas price to use",
    maxFeePerGas: "The max fee per gas to use",
    maxPriorityFeePerGas: "The max priority fee per gas to use",
};

function buildContractMethodPromptTask({
    taskPath, description, methodType, method, handlers, argumentsFactory, txOptionsSpec,
}) {
    const argumentSpecs = argumentsFactory();
    let taskBuilder = task(taskPath, description);

    for (const {name, description: argumentDescription} of argumentSpecs) {
        taskBuilder = taskBuilder.addOption({
            name,
            description: argumentDescription,
            type: ArgumentType.STRING_WITHOUT_DEFAULT,
            defaultValue: undefined,
        });
    }

    const txOptionKeys = Object.keys(methodType === "call" ? (txOptionsSpec || {}) : txOptionArgumentSpecs);
    for (const optionKey of txOptionKeys) {
        taskBuilder = taskBuilder.addOption({
            name: optionKey,
            description: txOptionArgumentSpecs[optionKey],
            type: ArgumentType.STRING_WITHOUT_DEFAULT,
            defaultValue: undefined,
        });
    }

    taskBuilder = taskBuilder
        .addOption({
            name: "deploymentId",
            description: "An optional ignition deployment id",
            type: ArgumentType.STRING_WITHOUT_DEFAULT,
            defaultValue: undefined,
        })
        .addOption({
            name: "deployedContractId",
            description: "An optional ignition deployed contract id",
            type: ArgumentType.STRING_WITHOUT_DEFAULT,
            defaultValue: undefined,
        })
        .addFlag({
            name: "eipReplayProtection",
            description: "Whether to use an eip155 signature for the transaction",
        })
        .addFlag({
            name: "nonInteractive",
            description: "Whether to throw an error because the task became interactive",
        })
        .addOption({
            name: "methodPromptTask",
            description: `Internal option for ${description}`,
            type: ArgumentType.STRING,
            defaultValue: taskPath.slice(1).join(":"),
            hidden: true,
        });

    return taskBuilder.setAction(() => import("./task-action.js")).build();
}

const promptHandlers = {
    mint: {
        onError: (e) => {
            console.error("There was an error while running this method");
            console.error(e);
        },
        onSuccess: (tx) => {
            console.log("Tokens minted successfully:", tx);
        },
    },
    owner: (hre) => ({
        onError: (e) => {
            console.error("There was an error while running this method");
            console.error(e);
        },
        onSuccess: async (value) => {
            console.log("Owner:", value);
            const signers = await hre.common.getSigners();
            for (let index = 0; index < signers.length; index++) {
                const address = hre.common.getAddress(signers[index]);
                if (address.toLowerCase() === value.toLowerCase()) {
                    console.log("This address belongs to the account with index:", index);
                }
            }
        },
    }),
    transferOwnership: {
        onError: (e) => {
            console.error("There was an error while running this method");
            console.error(e);
        },
        onSuccess: (tx) => {
            console.log("Ownership transferred successfully:", tx);
        },
    },
    renounceOwnership: {
        onError: (e) => {
            console.error("There was an error while running this method");
            console.error(e);
        },
        onSuccess: (tx) => {
            console.log("Ownership renounced successfully:", tx);
        },
    },
};

const smartAddressArgument = {
    name: "to",
    description: "The address to mint tokens to",
    message: "Who do you want to mint tokens to?",
    argumentType: "smart-address",
};

const ownedMethodPromptTasks = [
    emptyTask(["invoke", "ownable"], "Prompted Ownable method calls").build(),
    emptyTask(["invoke", "erc20", "owned"], "Prompted owned ERC-20 method calls").build(),
    emptyTask(["invoke", "erc721", "owned"], "Prompted owned ERC-721 method calls").build(),
    emptyTask(["invoke", "erc1155", "owned"], "Prompted owned ERC-1155 method calls").build(),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "erc20", "owned", "mint"],
        description: "Invokes mint(address,uint256) on an Owned ERC-20 contract",
        methodType: "send",
        method: "mint",
        handlers: promptHandlers.mint,
        argumentsFactory: () => [
            smartAddressArgument,
            {
                name: "amount",
                description: "The amount to mint",
                message: "What's the amount to mint?",
                argumentType: "uint256",
            },
        ],
    }),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "erc721", "owned", "mint"],
        description: "Invokes safeMint(address,uint256) on an Owned ERC-721 contract",
        methodType: "send",
        method: "safeMint(address,uint256)",
        handlers: promptHandlers.mint,
        argumentsFactory: () => [
            {
                ...smartAddressArgument,
                description: "The address to mint a token to",
                message: "Who do you want to mint a token to?",
            },
            {
                name: "tokenId",
                description: "The ID of the token to mint",
                message: "What's the ID of the token to mint?",
                argumentType: "uint256",
            },
        ],
    }),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "erc721", "owned", "mint-with-data"],
        description: "Invokes safeMint(address,uint256,bytes) on an Owned ERC-721 contract",
        methodType: "send",
        method: "safeMint(address,uint256,bytes)",
        handlers: promptHandlers.mint,
        argumentsFactory: () => [
            {
                ...smartAddressArgument,
                description: "The address to mint a token to",
                message: "Who do you want to mint a token to?",
            },
            {
                name: "tokenId",
                description: "The ID of the token to mint",
                message: "What's the ID of the token to mint?",
                argumentType: "uint256",
            },
            {
                name: "data",
                description: "The data of the mint",
                message: "Enter the data for this mint",
                argumentType: "bytes",
            },
        ],
    }),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "erc1155", "owned", "mint"],
        description: "Invokes mint(address,uint256,uint256,bytes) on an Owned ERC-1155 contract",
        methodType: "send",
        method: "mint",
        handlers: promptHandlers.mint,
        argumentsFactory: () => [
            smartAddressArgument,
            {
                name: "tokenId",
                description: "The ID of the token to mint",
                message: "What's the ID of the token to mint?",
                argumentType: "uint256",
            },
            {
                name: "amount",
                description: "The amount of the token to mint",
                message: "What's the amount of the token to mint?",
                argumentType: "uint256",
            },
            {
                name: "data",
                description: "The data of the mint",
                message: "Enter the data for this mint",
                argumentType: "bytes",
            },
        ],
    }),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "erc1155", "owned", "mint-batch"],
        description: "Invokes mintBatch(address,uint256[],uint256[],bytes) on an Owned ERC-1155 contract",
        methodType: "send",
        method: "mintBatch",
        handlers: promptHandlers.mint,
        argumentsFactory: (hre) => [
            smartAddressArgument,
            hre?.blueprints.arrayArgument({
                message: "Tell the IDs of the tokens to mint",
                description: "The IDs of the tokens to mint",
                name: "tokenIds",
                elements: {
                    argumentType: "uint256",
                    message: "Token ID #${index}",
                },
            }) || {
                name: "tokenIds",
                description: "The IDs of the tokens to mint",
            },
            hre?.blueprints.arrayArgument({
                message: "Tell the amounts of the tokens to mint",
                description: "The amounts of the tokens to mint",
                name: "amounts",
                elements: {
                    argumentType: "uint256",
                    message: "Token amount #${index}",
                },
            }) || {
                name: "amounts",
                description: "The amounts of the tokens to mint",
            },
            {
                name: "data",
                description: "The data of the mint",
                message: "Enter the data for this mint",
                argumentType: "bytes",
            },
        ],
    }),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "ownable", "owner"],
        description: "Invokes owner() on an Ownable contract",
        methodType: "call",
        method: "owner",
        handlers: promptHandlers.owner,
        argumentsFactory: () => [],
    }),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "ownable", "transfer-ownership"],
        description: "Invokes transferOwnership(address) on an Ownable contract",
        methodType: "send",
        method: "transferOwnership",
        handlers: promptHandlers.transferOwnership,
        argumentsFactory: () => [
            {
                name: "to",
                description: "The address to transfer ownership to",
                message: "Who do you want to transfer ownership to?",
                argumentType: "smart-address",
            },
        ],
    }),
    buildContractMethodPromptTask({
        taskPath: ["invoke", "ownable", "renounce-ownership"],
        description: "Invokes renounceOwnership() on an Ownable contract",
        methodType: "send",
        method: "renounceOwnership",
        handlers: promptHandlers.renounceOwnership,
        argumentsFactory: () => [],
    }),
];

function installOpenZeppelinCommonBlueprints(hre) {
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

}

const hardhatOpenZeppelinCommonBlueprintsPlugin = definePlugin({
    id: "hardhat-openzeppelin-common-blueprints",
    npmPackage: "hardhat-openzeppelin-common-blueprints",
    dependencies: () => [
        Promise.resolve({default: hardhatCommonToolsPlugin}),
        Promise.resolve({default: hardhatEnquirerPlusPlugin}),
        Promise.resolve({default: hardhatBlueprintsPlugin}),
        Promise.resolve({default: hardhatMethodPromptsPlugin}),
    ],
    hookHandlers: {
        hre: async () => ({
            default: async () => ({
                created: async (_context, hre) => {
                    installOpenZeppelinCommonBlueprints(hre);
                },
            }),
        }),
    },
    tasks: ownedMethodPromptTasks,
});

export {installOpenZeppelinCommonBlueprints};
export default hardhatOpenZeppelinCommonBlueprintsPlugin;
