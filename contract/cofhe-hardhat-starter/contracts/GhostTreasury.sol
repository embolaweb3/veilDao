// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GhostTreasury
 * @notice Fee vault for GhostGov quadratic voting payments.
 *
 * Receives ETH forwarded by GhostGov.castWeightedVote() and tracks fees
 * per proposal. Only GhostGov can call deposit(); owner withdraws fees.
 */
contract GhostTreasury is Ownable {

    address public immutable gov;

    mapping(uint256 => uint256) public proposalFees;
    uint256 public totalCollected;

    event FeeDeposited(uint256 indexed proposalId, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyGov() {
        require(msg.sender == gov, "Only GhostGov");
        _;
    }

    constructor(address gov_) Ownable(msg.sender) {
        gov = gov_;
    }

    /**
     * @notice Called by GhostGov.castWeightedVote() to record a quadratic fee.
     */
    function deposit(uint256 proposalId) external payable onlyGov {
        proposalFees[proposalId] += msg.value;
        totalCollected           += msg.value;
        emit FeeDeposited(proposalId, msg.value);
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        (bool ok,) = msg.sender.call{value: bal}("");
        require(ok, "Transfer failed");
        emit Withdrawn(msg.sender, bal);
    }

    receive() external payable {
        totalCollected += msg.value;
    }
}
