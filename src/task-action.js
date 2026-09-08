const onMethodError = (e) => {
    console.error("There was an error while running this method");
    console.error(e);
};

const onMintSuccess = (tx) => {
    console.log("Tokens minted successfully:", tx);
};

const smartAddressArgument = {
    name: "to",
    description: "The address to mint tokens to",
    message: "Who do you want to mint tokens to?",
    argumentType: "smart-address",
};

function arrayArgument(hre, spec) {
    return hre.blueprints.arrayArgument(spec);
}

function getTaskSpec(hre, key) {
    const specs = {
        "erc20:owned:mint": {
            methodType: "send",
            method: "mint",
            handlers: {onError: onMethodError, onSuccess: onMintSuccess},
            argumentsSpec: [
                smartAddressArgument,
                {
                    name: "amount",
                    description: "The amount to mint",
                    message: "What's the amount to mint?",
                    argumentType: "uint256",
                },
            ],
        },
        "erc721:owned:mint": {
            methodType: "send",
            method: "safeMint(address,uint256)",
            handlers: {onError: onMethodError, onSuccess: onMintSuccess},
            argumentsSpec: [
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
        },
        "erc721:owned:mint-with-data": {
            methodType: "send",
            method: "safeMint(address,uint256,bytes)",
            handlers: {onError: onMethodError, onSuccess: onMintSuccess},
            argumentsSpec: [
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
        },
        "erc1155:owned:mint": {
            methodType: "send",
            method: "mint",
            handlers: {onError: onMethodError, onSuccess: onMintSuccess},
            argumentsSpec: [
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
        },
        "erc1155:owned:mint-batch": {
            methodType: "send",
            method: "mintBatch",
            handlers: {onError: onMethodError, onSuccess: onMintSuccess},
            argumentsSpec: [
                smartAddressArgument,
                arrayArgument(hre, {
                    message: "Tell the IDs of the tokens to mint",
                    description: "The IDs of the tokens to mint",
                    name: "tokenIds",
                    elements: {
                        argumentType: "uint256",
                        message: "Token ID #${index}",
                    },
                }),
                arrayArgument(hre, {
                    message: "Tell the amounts of the tokens to mint",
                    description: "The amounts of the tokens to mint",
                    name: "amounts",
                    elements: {
                        argumentType: "uint256",
                        message: "Token amount #${index}",
                    },
                }),
                {
                    name: "data",
                    description: "The data of the mint",
                    message: "Enter the data for this mint",
                    argumentType: "bytes",
                },
            ],
        },
        "ownable:owner": {
            methodType: "call",
            method: "owner",
            handlers: {
                onError: onMethodError,
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
            },
            argumentsSpec: [],
            txOptionsSpec: {},
        },
        "ownable:transfer-ownership": {
            methodType: "send",
            method: "transferOwnership",
            handlers: {
                onError: onMethodError,
                onSuccess: (tx) => {
                    console.log("Ownership transferred successfully:", tx);
                },
            },
            argumentsSpec: [{
                name: "to",
                description: "The address to transfer ownership to",
                message: "Who do you want to transfer ownership to?",
                argumentType: "smart-address",
            }],
        },
        "ownable:renounce-ownership": {
            methodType: "send",
            method: "renounceOwnership",
            handlers: {
                onError: onMethodError,
                onSuccess: (tx) => {
                    console.log("Ownership renounced successfully:", tx);
                },
            },
            argumentsSpec: [],
        },
    };

    return specs[key];
}

export default async function runOpenZeppelinCommonBlueprintTask(args, hre) {
    const spec = getTaskSpec(hre, args.methodPromptTask);
    if (spec === undefined) {
        throw new Error(`Unknown hardhat-openzeppelin-common-blueprints task: ${args.methodPromptTask}`);
    }

    const givenArguments = Object.fromEntries(spec.argumentsSpec.map(({name}) => [name, args[name]]));
    const txOptionKeys = ["account", "value", "gas", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas"];
    const givenTxOptions = Object.fromEntries(txOptionKeys.map((name) => [name, args[name]]));
    givenTxOptions.eip155 = args.eipReplayProtection;

    const prompt = new hre.methodPrompts.ContractMethodPrompt(
        spec.methodType,
        spec.method,
        spec.handlers,
        spec.argumentsSpec,
        spec.txOptionsSpec || {}
    );
    await prompt.invoke(
        args.deploymentId,
        args.deployedContractId,
        givenArguments,
        givenTxOptions,
        args.nonInteractive
    );
}
