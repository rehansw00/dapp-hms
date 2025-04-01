// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DoctorRegistry {
    struct Doctor {
        address walletAddress;
        string licenseNumber;
        string specialty;
        bool isRegistered;
    }

    mapping(address => Doctor) public doctors;
    address[] public doctorAddresses;

    event DoctorRegistered(address indexed walletAddress, string licenseNumber);

    function registerDoctor(
        address _walletAddress,
        string memory _licenseNumber,
        string memory _specialty
    ) external {
        require(!doctors[_walletAddress].isRegistered, "Doctor already registered");
        
        doctors[_walletAddress] = Doctor({
            walletAddress: _walletAddress,
            licenseNumber: _licenseNumber,
            specialty: _specialty,
            isRegistered: true
        });
        
        doctorAddresses.push(_walletAddress);
        emit DoctorRegistered(_walletAddress, _licenseNumber);
    }

    function getDoctor(address _walletAddress) external view returns (Doctor memory) {
        return doctors[_walletAddress];
    }
}