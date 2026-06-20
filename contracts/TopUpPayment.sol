// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TopUpPayment {
    // Owner of the contract
    address public owner;

    // Struct to store transaction details
    struct Transaction {
        address buyer;
        string gameId;
        string gameName;
        string packageName;
        uint256 amount;
        uint256 timestamp;
    }

    // Mapping from user address to their transactions
    mapping(address => Transaction[]) public userTransactions;
    
    // All transactions for global history
    Transaction[] public allTransactions;

    // Event emitted when a top-up is successful
    event TopUpSuccessful(
        address indexed buyer,
        string gameId,
        string gameName,
        string packageName,
        uint256 amount,
        uint256 timestamp
    );

    // Event emitted when ETH is withdrawn
    event Withdrawal(address indexed to, uint256 amount);

    // Modifier to restrict access to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Constructor to set owner
    constructor() {
        owner = msg.sender;
    }

    // Function to process top-up payment
    function processTopUp(
        string memory _gameId,
        string memory _gameName,
        string memory _packageName
    ) external payable {
        require(msg.value > 0, "Must send ETH to top-up");

        Transaction memory newTransaction = Transaction({
            buyer: msg.sender,
            gameId: _gameId,
            gameName: _gameName,
            packageName: _packageName,
            amount: msg.value,
            timestamp: block.timestamp
        });

        userTransactions[msg.sender].push(newTransaction);
        allTransactions.push(newTransaction);

        emit TopUpSuccessful(
            msg.sender,
            _gameId,
            _gameName,
            _packageName,
            msg.value,
            block.timestamp
        );
    }

    // Function to get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to withdraw ETH from contract (only owner)
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool sent, ) = owner.call{value: balance}("");
        require(sent, "Failed to send ETH");

        emit Withdrawal(owner, balance);
    }

    // Function to get user's transaction count
    function getUserTransactionCount(address _user) external view returns (uint256) {
        return userTransactions[_user].length;
    }

    // Function to get all transactions of a user
    function getUserTransactions(address _user) external view returns (Transaction[] memory) {
        return userTransactions[_user];
    }

    // Function to get total transaction count
    function getTotalTransactionCount() external view returns (uint256) {
        return allTransactions.length;
    }

    // Receive function to accept ETH transfers
    receive() external payable {
        // Simple accept ETH (for testing)
        Transaction memory newTransaction = Transaction({
            buyer: msg.sender,
            gameId: "unknown",
            gameName: "unknown",
            packageName: "unknown",
            amount: msg.value,
            timestamp: block.timestamp
        });

        userTransactions[msg.sender].push(newTransaction);
        allTransactions.push(newTransaction);

        emit TopUpSuccessful(
            msg.sender,
            "unknown",
            "unknown",
            "unknown",
            msg.value,
            block.timestamp
        );
    }

    // Fallback function for any other calls
    fallback() external payable {
        revert("Use processTopUp function or send ETH directly");
    }
}
