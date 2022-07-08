// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IEventERC1155v2 {

    function baseFolderURIHash() external view returns (string memory);
    
    function baseFilename() external view returns (string memory);
    function baseExtension() external view returns (string memory);
    function events(uint256 _id) external view returns (string memory, string memory,uint256 ,string memory, address ,string memory);
    // function allEvents() external view returns (Event[] memory);
    function getNftsIdsOfUser(address minter) external view returns (uint256[] memory);
    function allEvents() external view returns (Event[] memory);

    function addUserToEvent(address[] memory _to,uint256  _id,bytes memory _data) external;
    function createEvent(address eventOwner, string memory _name, string memory _description, string memory email, string memory _eventUri) external;

    function testField() external view returns (string memory);
    
    event EventCreated(address indexed _owner, string _name, string _description, string _eventUri, uint256 indexed _eventId, string email);

    struct Event {
        string eventName;
        string eventDescription;
        uint256 eventId;
        string eventUri;
        address eventOwner;
        string email;
    }
}
