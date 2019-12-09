pragma solidity 0.5.0;
//Smart contract per upload del test

contract UploadHash {
  string public hashText;
  uint public count = 0;

  mapping(uint => EternityFile) public array;

  address owner;
  uint256 timestamp;

  constructor() public{
    owner = 0x27360BFf63d537313d1Fa9e0BA7C6Fc39301c656;
  }

  modifier onlyOwner(){
    require(msg.sender == owner);
    _;
  }

  struct EternityFile{
    uint _id;
    string _plainText;
    string _hashText;
    address _customer;
    }

  function addNewFile(string memory _plainText, string memory _hashText) public{
    count += 1;
    array[count] = EternityFile(count, _hashText, _plainText, msg.sender);
  }

  function getFile(uint index) public view returns(string memory, string memory, address) {
      return (array[index]._plainText, array[index]._hashText, array[index]._customer);
  }

  function getSize() public view returns(uint){
    return count;
  }



  //funzione per scrivere nella blockchain
  function set(string memory _hashText) public {
    hashText = _hashText;

  }

  //Funzione per leggere dalla blockchain
  function get() public view returns(string memory){
    return hashText;
  }


}
