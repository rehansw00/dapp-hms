// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HospitalManagement {
    address public owner;
    
    struct Doctor {
        string name;
        string specialty;
        string licenseNumber;
        string department;
        string contactInfo;
        bool isActive;
        uint256 dateAdded;
    }
    
    struct Patient {
        string name;
        uint256 age;
        string gender;
        address[] authorizedDoctors;
        bool isRegistered;
        uint256 dateRegistered;
    }
    
    struct MedicalRecord {
        uint256 patientId;
        address doctorAddress;
        string recordType;
        string diagnosis;
        string symptoms;
        string treatment;
        string medications;
        string notes;
        uint256 timestamp;
        bytes32 recordHash;
    }
    
    mapping(address => Doctor) public doctors;
    mapping(address => bool) public isDoctor;
    mapping(address => bool) public isAdmin;
    
    mapping(address => Patient) public patients;
    mapping(address => bool) public isPatient;
    
    mapping(address => mapping(uint256 => MedicalRecord)) public patientRecords;
    mapping(address => uint256) public patientRecordCount;
    
    event DoctorAdded(address indexed doctorAddress, string name, string specialty);
    event DoctorRemoved(address indexed doctorAddress);
    event PatientRegistered(address indexed patientAddress, string name);
    event MedicalRecordAdded(address indexed patientAddress, uint256 recordId, bytes32 recordHash);
    event DoctorAuthorized(address indexed patientAddress, address indexed doctorAddress);
    event DoctorDeauthorized(address indexed patientAddress, address indexed doctorAddress);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(isAdmin[msg.sender] || msg.sender == owner, "Only admin can call this function");
        _;
    }
    
    modifier onlyDoctor() {
        require(isDoctor[msg.sender], "Only registered doctors can call this function");
        _;
    }
    
    modifier onlyPatient() {
        require(isPatient[msg.sender], "Only registered patients can call this function");
        _;
    }
    
    modifier onlyAuthorized(address patientAddress) {
        require(
            msg.sender == patientAddress || 
            msg.sender == owner || 
            isAdmin[msg.sender] || 
            isAuthorizedDoctor(patientAddress, msg.sender),
            "Not authorized to access this patient's records"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }
    
    function addAdmin(address adminAddress) external onlyOwner {
        isAdmin[adminAddress] = true;
    }
    
    function removeAdmin(address adminAddress) external onlyOwner {
        require(adminAddress != owner, "Cannot remove owner as admin");
        isAdmin[adminAddress] = false;
    }
    
    function addDoctor(
        address doctorAddress,
        string memory name,
        string memory specialty,
        string memory licenseNumber,
        string memory department,
        string memory contactInfo
    ) external onlyAdmin {
        require(!isDoctor[doctorAddress], "Doctor already registered");
        
        doctors[doctorAddress] = Doctor({
            name: name,
            specialty: specialty,
            licenseNumber: licenseNumber,
            department: department,
            contactInfo: contactInfo,
            isActive: true,
            dateAdded: block.timestamp
        });
        
        isDoctor[doctorAddress] = true;
        
        emit DoctorAdded(doctorAddress, name, specialty);
    }
    
    function removeDoctor(address doctorAddress) external on  name, specialty);
    }
    
    function removeDoctor(address doctorAddress) external onlyAdmin {
        require(isDoctor[doctorAddress], "Doctor not registered");
        
        doctors[doctorAddress].isActive = false;
        isDoctor[doctorAddress] = false;
        
        emit DoctorRemoved(doctorAddress);
    }
    
    function registerPatient(
        string memory name,
        uint256 age,
        string memory gender
    ) external {
        require(!isPatient[msg.sender], "Patient already registered");
        
        address[] memory emptyArray = new address[](0);
        
        patients[msg.sender] = Patient({
            name: name,
            age: age,
            gender: gender,
            authorizedDoctors: emptyArray,
            isRegistered: true,
            dateRegistered: block.timestamp
        });
        
        isPatient[msg.sender] = true;
        
        emit PatientRegistered(msg.sender, name);
    }
    
    function authorizeDoctor(address doctorAddress) external onlyPatient {
        require(isDoctor[doctorAddress], "Not a registered doctor");
        require(doctors[doctorAddress].isActive, "Doctor is not active");
        require(!isAuthorizedDoctor(msg.sender, doctorAddress), "Doctor already authorized");
        
        patients[msg.sender].authorizedDoctors.push(doctorAddress);
        
        emit DoctorAuthorized(msg.sender, doctorAddress);
    }
    
    function deauthorizeDoctor(address doctorAddress) external onlyPatient {
        require(isAuthorizedDoctor(msg.sender, doctorAddress), "Doctor not authorized");
        
        address[] storage authorizedDoctors = patients[msg.sender].authorizedDoctors;
        for (uint i = 0; i < authorizedDoctors.length; i++) {
            if (authorizedDoctors[i] == doctorAddress) {
                // Replace with the last element and pop
                authorizedDoctors[i] = authorizedDoctors[authorizedDoctors.length - 1];
                authorizedDoctors.pop();
                break;
            }
        }
        
        emit DoctorDeauthorized(msg.sender, doctorAddress);
    }
    
    function isAuthorizedDoctor(address patientAddress, address doctorAddress) public view returns (bool) {
        address[] storage authorizedDoctors = patients[patientAddress].authorizedDoctors;
        for (uint i = 0; i < authorizedDoctors.length; i++) {
            if (authorizedDoctors[i] == doctorAddress) {
                return true;
            }
        }
        return false;
    }
    
    function addMedicalRecord(
        address patientAddress,
        string memory recordType,
        string memory diagnosis,
        string memory symptoms,
        string memory treatment,
        string memory medications,
        string memory notes
    ) external onlyDoctor onlyAuthorized(patientAddress) {
        require(isPatient[patientAddress], "Patient not registered");
        
        uint256 recordId = patientRecordCount[patientAddress];
        
        // Create a hash of the record for verification
        bytes32 recordHash = keccak256(abi.encodePacked(
            patientAddress,
            msg.sender,
            recordType,
            diagnosis,
            symptoms,
            treatment,
            medications,
            notes,
            block.timestamp,
            recordId
        ));
        
        MedicalRecord memory newRecord = MedicalRecord({
            patientId: recordId,
            doctorAddress: msg.sender,
            recordType: recordType,
            diagnosis: diagnosis,
            symptoms: symptoms,
            treatment: treatment,
            medications: medications,
            notes: notes,
            timestamp: block.timestamp,
            recordHash: recordHash
        });
        
        patientRecords[patientAddress][recordId] = newRecord;
        patientRecordCount[patientAddress]++;
        
        emit MedicalRecordAdded(patientAddress, recordId, recordHash);
    }
    
    function getMedicalRecord(address patientAddress, uint256 recordId) 
        external 
        view 
        onlyAuthorized(patientAddress) 
        returns (
            uint256 patientId,
            address doctorAddress,
            string memory recordType,
            string memory diagnosis,
            string memory symptoms,
            string memory treatment,
            string memory medications,
            string memory notes,
            uint256 timestamp,
            bytes32 recordHash
        ) 
    {
        require(recordId < patientRecordCount[patientAddress], "Record does not exist");
        
        MedicalRecord storage record = patientRecords[patientAddress][recordId];
        
        return (
            record.patientId,
            record.doctorAddress,
            record.recordType,
            record.diagnosis,
            record.symptoms,
            record.treatment,
            record.medications,
            record.notes,
            record.timestamp,
            record.recordHash
        );
    }
    
    function getPatientRecordCount(address patientAddress) 
        external 
        view 
        onlyAuthorized(patientAddress) 
        returns (uint256) 
    {
        return patientRecordCount[patientAddress];
    }
    
    function getDoctorInfo(address doctorAddress) 
        external 
        view 
        returns (
            string memory name,
            string memory specialty,
            string memory department,
            bool isActive,
            uint256 dateAdded
        ) 
    {
        require(isDoctor[doctorAddress] || doctors[doctorAddress].dateAdded > 0, "Doctor not found");
        
        Doctor storage doctor = doctors[doctorAddress];
        
        return (
            doctor.name,
            doctor.specialty,
            doctor.department,
            doctor.isActive,
            doctor.dateAdded
        );
    }
    
    function getPatientInfo(address patientAddress) 
        external 
        view 
        onlyAuthorized(patientAddress) 
        returns (
            string memory name,
            uint256 age,
            string memory gender,
            uint256 recordCount,
            uint256 dateRegistered
        ) 
    {
        require(isPatient[patientAddress], "Patient not found");
        
        Patient storage patient = patients[patientAddress];
        
        return (
            patient.name,
            patient.age,
            patient.gender,
            patientRecordCount[patientAddress],
            patient.dateRegistered
        );
    }
    
    function getAuthorizedDoctors(address patientAddress) 
        external 
        view 
        onlyAuthorized(patientAddress) 
        returns (address[] memory) 
    {
        require(isPatient[patientAddress], "Patient not found");
        
        return patients[patientAddress].authorizedDoctors;
    }
    
    function verifyRecordHash(address patientAddress, uint256 recordId, bytes32 hash) 
        external 
        view 
        returns (bool) 
    {
        require(recordId < patientRecordCount[patientAddress], "Record does not exist");
        
        return patientRecords[patientAddress][recordId].recordHash == hash;
    }
}

