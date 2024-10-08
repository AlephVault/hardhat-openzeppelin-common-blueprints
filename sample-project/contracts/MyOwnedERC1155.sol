// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * This is a general-purpose (FT, NFT, SFT) token contract
 * which is related to an owner.
 *
 * Feel free to edit these notes accordingly, but after
 * reading these notes first:
 *
 * Ideally, after setup, transferOwnership should be
 * invoked to transfer the ownership of this contract to a
 * new address which should be another contract. This ensures
 * that the ownership of this contract is fair and related to
 * a greater logic or ruleset.
 */
contract MyOwnedERC1155 is ERC1155, Ownable {
    /**
     * The URL is not needed here: we'll generate proper data
     * URIs for each token.
     */
    constructor() ERC1155("about:blank") Ownable(msg.sender) {}

    /**
     * Mints a specific token (in the desired amount) for an
     * account. Only the owner is allowed to execute this action.
     */
    function mint(address to, uint256 id, uint256 value, bytes memory data) public onlyOwner {
        _mint(to, id, value, data);
    }

    /**
     * Mints a bulk of tokens (in the desired amounts) for an
     * account. Only the owner is allowed to execute this action.
     * You might consider this method optional and/or delete it.
     */
    function mintBatch(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, values, data);
    }

    /*
     * Feel free to either uncomment or remove these methods (or also
     * change who is allowed to burn, if not both subjects, the token
     * held by an owner) and its corresponding error.
     *
     * error InvalidBurner(address sender);
     *
     * function burn(address from, uint256 id, uint256 amount) public {
     *     address sender = _msgSender();
     *     if (owner() != sender && from != sender) {
     *         revert InvalidBurner(sender);
     *     }
     *     _burn(from, id, amount);
     * }
     *
     * function burnBatch(address from, uint256[] memory ids, uint256[] memory amounts) public {
     *     address sender = _msgSender();
     *     if (owner() != sender && from != sender) {
     *         revert InvalidBurner(sender);
     *     }
     *     _burnBatch(from, ids, amounts);
     * }
     */

    /**
     * Retrieves the metadata of the token.
     */
    function _getTokenMetadata(uint256 id) internal view returns (
        string memory name, string memory description, string memory image
    ) {
        // TODO Feel free to revert somehow if the token does not exist.
        // TODO also, feel free to return more data if needed for your
        // TODO "properties" sub-dictionary below.
        name = "";
        description = "";
        image = "";
    }

    /**
     * Retrieves a JSON with the metadata of the token.
     * See https://eips.ethereum.org/EIPS/eip-721 for more details.
     */
    function uri(uint256 id) public view override returns (string memory) {
        (string memory name, string memory description, string memory image) = _getTokenMetadata(id);

        // Feel free to add more things to the "properties" sub-dictionary.
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(abi.encodePacked(
            '{"name":"', name, '","description":"', description, '","image":"', image,
            '","properties":{}}'
        ))));
    }

    function someTuple() public view returns (string memory, uint256, bool, bytes32) {
        return ("abc", 1, false, 0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef);
    }
}
