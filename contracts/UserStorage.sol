// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserStorage {
    struct User {
        string role;
        string name;
        string email;
        uint256 signupTimestamp;
        uint256 lastLoginTimestamp;
    }
    
    mapping(address => User) public users;
    address[] public userAddresses;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function addUser(string memory _role, string memory _name, string memory _email) public {
        require(users[msg.sender].signupTimestamp == 0, "User already exists");
        users[msg.sender] = User(_role, _name, _email, block.timestamp, 0);
        userAddresses.push(msg.sender);
    }

    function getAllUsers() public view returns (User[] memory) {
        require(msg.sender == admin, "Only admin can access");
        User[] memory allUsers = new User[](userAddresses.length);
        for(uint i = 0; i < userAddresses.length; i++) {
            allUsers[i] = users[userAddresses[i]];
        }
        return allUsers;
    }

    function recordLogin(address _user) public {
        require(users[_user].signupTimestamp != 0, "User does not exist");
        users[_user].lastLoginTimestamp = block.timestamp;
    }
}