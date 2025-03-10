// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    struct Land {
        uint256 id;
        string location;
        uint256 acreage;
        uint256 price;
        address owner;
        bool isRegistered;
    }

    mapping(uint256 => Land) public lands; // Store lands by ID
    mapping(address => uint256[]) public ownerLands; // Track lands owned by each user
    uint256 public landCount = 0;

    event LandRegistered(uint256 id, string location, uint256 acreage, uint256 price, address indexed owner);
    event OwnershipTransferred(uint256 id, address indexed oldOwner, address indexed newOwner, string sellerName, string buyerName);
    event LandDeregistered(uint256 id);
    event LandPriceUpdated(uint256 id, uint256 oldPrice, uint256 newPrice);

    constructor() {
        // Initialize with 50 default lands
        for (uint256 i = 1; i <= 2; i++) {
            lands[i] = Land(i, string(abi.encodePacked("Location ", uint2str(i))), i * 10, i * 1000, msg.sender, true);
            ownerLands[msg.sender].push(i);
            emit LandRegistered(i, lands[i].location, lands[i].acreage, lands[i].price, msg.sender);
        }
        landCount = 50;
    }

    // Register a new land property
    function registerLand(string memory _location, uint256 _acreage, uint256 _price) public {
        landCount++;
        lands[landCount] = Land(landCount, _location, _acreage, _price, msg.sender, true);
        ownerLands[msg.sender].push(landCount);
        
        emit LandRegistered(landCount, _location, _acreage, _price, msg.sender);
    }

    // Transfer land ownership
    function transferOwnership(uint256 _landId, address _newOwner, string memory _sellerName, string memory _buyerName) public payable {
        require(lands[_landId].isRegistered, "Land not registered");
        require(lands[_landId].owner == msg.sender, "Only owner can transfer");
        require(lands[_landId].owner != _newOwner, "New owner must be different from current owner");
        require(msg.value >= lands[_landId].price, "Insufficient payment");

        address previousOwner = lands[_landId].owner;
        lands[_landId].owner = _newOwner;
        
        emit OwnershipTransferred(_landId, previousOwner, _newOwner, _sellerName, _buyerName);
    }

    // Get land details
    function getLand(uint256 _landId) public view returns (string memory, uint256, uint256, address) {
        require(lands[_landId].isRegistered, "Land not registered");
        Land memory land = lands[_landId];
        return (land.location, land.acreage, land.price, land.owner);
    }

    // Update land price
    function updateLandPrice(uint256 _landId, uint256 _newPrice) public {
        require(lands[_landId].isRegistered, "Land not registered");
        require(lands[_landId].owner == msg.sender, "Only owner can update price");

        uint256 oldPrice = lands[_landId].price;
        lands[_landId].price = _newPrice;

        emit LandPriceUpdated(_landId, oldPrice, _newPrice);
    }

    // Deregister a land
    function deregisterLand(uint256 _landId) public {
        require(lands[_landId].isRegistered, "Land not registered");
        require(lands[_landId].owner == msg.sender, "Only owner can deregister");

        lands[_landId].isRegistered = false;

        emit LandDeregistered(_landId);
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        while (_i != 0) {
            bstr[--length] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
