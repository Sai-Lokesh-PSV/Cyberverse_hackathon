// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ParcelRegistry {
    struct Parcel {
        uint id;
        string owner;
        string hash;
    }

    mapping(uint => Parcel) public parcels;

    function createParcel(uint _id, string memory _owner, string memory _hash) public {
        parcels[_id] = Parcel(_id, _owner, _hash);
    }

    function getParcel(uint _id) public view returns (Parcel memory) {
        return parcels[_id];
    }
}
