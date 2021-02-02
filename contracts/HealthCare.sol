
pragma solidity >=0.4.22 <0.8.0;
contract HealthCare { 
  struct User {       
    string name;    
    string role;
    string approved;    
  }
  mapping(address => User) public users;  
  function registerRoles (string memory _name,string memory _role,string memory _approved) public {
        require(bytes(users[msg.sender].role).length<=0);
        users[msg.sender] = User(_name,_role,_approved); 
        //emit registeredEvent(msg.sender);
    }
  
}
