// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/IEventERC1155.sol";

contract EventERC1155 is 
    ERC1155Upgradeable,  
    AccessControlUpgradeable, 
    IEventERC1155,
    UUPSUpgradeable, 
    PausableUpgradeable  {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    
    string public name;
    string public symbol;

    string public override baseFolderURIHash;
    string public override baseFilename;
    string public override baseExtension;

    CountersUpgradeable.Counter private _eventIdCounter;

    Event[] public override events;

    mapping(address => uint256[]) private userNFTs;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC1155_init(string(
            abi.encodePacked(
                "ipfs://",
                baseFolderURIHash,
                "/",
                baseFilename,
                "0",
                baseExtension
            )
        ));
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __Pausable_init();
        name="Events NFT";
        symbol="EVNFT";

        baseFolderURIHash="QmWinYKyWWRFHShCsTPtdqkHkPQHBf7XT7VTrPReXxquRc";
        baseFilename = "lion";
        baseExtension = ".json";
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        events.push(Event("","",0,"",address(0),""));
        // _mint(_msgSender(), 1, 10, "");
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(DEFAULT_ADMIN_ROLE) whenPaused {}

    function uri(uint256 _tokenid) override public view returns (string memory) {
        return string(
            abi.encodePacked(
                "ipfs://",
                baseFolderURIHash,
                "/",
                baseFilename,
                Strings.toString(_tokenid),
                baseExtension
            )
        );
    }

    function createEvent(address eventOwner, string memory _name, string memory _description, string memory email, string memory _eventUri) override external onlyRole(DEFAULT_ADMIN_ROLE) {
        _eventIdCounter.increment();
        events.push(Event(_name, _description, _eventIdCounter.current(), _eventUri, eventOwner, email));
        emit EventCreated(eventOwner, _name, _description, _eventUri,  _eventIdCounter.current(), email);
    }

    function addUserToEvent(
        address[] memory _to,
        uint256  _id,
        bytes memory _data // could be empty string or 0x0
    ) override external onlyEventOwner(_id)  whenNotPaused {
        for (uint256 i = 0; i < _to.length; i++) {
            if(balanceOf(_to[i],    _id)==0){
                _mint(_to[i],_id, 1,_data);
                userNFTs[_to[i]].push(_id);
            }
        }
    }

    function getNftsIdsOfUser(address minter) external override  view returns (uint256[] memory) {
        return userNFTs[minter];
    }

    function allEvents() override external view returns (Event[] memory) {
        return events;
    }
 

    function setFolderURIHash(string calldata _uriFolderHash) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseFolderURIHash=_uriFolderHash;
    }

    function setBaseFilename(string memory _newBaseFilename) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseFilename = _newBaseFilename;
    }

    function setBaseExtension(string memory _newBaseExtension) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseExtension = _newBaseExtension;
    }

     /**
     * @notice Pauses the whole contract; used as emergency response
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        _pause();
    }

    /**
     * @notice unpauses the contract; resumes functionality.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) whenPaused  {
        _unpause();
    }

    /**
     * @notice returns true if a given interface is supported
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    modifier onlyEventOwner(uint256 _id) {
        require(events[_id].eventOwner == _msgSender(), 'Only event owner can set event minters');
        _;
    }

}