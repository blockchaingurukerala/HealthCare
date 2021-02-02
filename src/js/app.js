App = {
  loading: false,
  contracts: {},
  manfdisplay:0,

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    
  },
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const HealthCare = await $.getJSON('HealthCare.json')
    App.contracts.HealthCare = TruffleContract(HealthCare)
    App.contracts.HealthCare.setProvider(App.web3Provider)

    // Retrieve the smart contract with values from the blockchain
    App.healthcare = await App.contracts.HealthCare.deployed()
  },
  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    } 
    var user=await App.healthcare.users(App.account);   
    var role=user.role;
    console.log("Role="+role);
    var home = $("#home");  
    var patientpage = $("#patientpage"); 
    var doctorpage = $("#doctorpage"); 
    var insuarancepage = $("#insuarancepage");  
    var register = $("#register");  
    if(role=="1"){
      //Patient
      
      home.hide();  
      patientpage.show(); 
      doctorpage.hide();
      insuarancepage.hide();   
      register.hide();
    }
    else if(role=="2"){
      //Insurance Agent
      home.hide();  
      patientpage.hide(); 
      doctorpage.hide();
      insuarancepage.show();   
      register.hide();
    }
    else if(role=="3"){
      //Doctor
      home.hide();  
      patientpage.hide(); 
      doctorpage.show();
      insuarancepage.hide();   
      register.hide();
    }
    else{
      //Not Yet Registered
      home.hide();  
      patientpage.hide(); 
      doctorpage.hide();
      insuarancepage.hide();   
      register.show();
    }
  },
  setLoading: (boolean) => {
    App.loading = boolean
 
  },
  registerRole:async ()=>{
    var userFullname=$("#userFullname").val();
    
    var role=$("#RoleSelect").val();
    //console.log("Selected role is=",role);     
   
    await App.healthcare.registerRoles(userFullname,role,"false", { from: App.account });      
    alert("Registered successfully"); 
    await App.render();
  }  
}

// $(() => {
//   $(window).load(() => {
//     App.load()
//   })
// })

function loginClick(){
  //alert("MetaMask Connection clicked");
  App.load();
}
