/*import React, { Component } from 'react'
import MarketPlaceContract from '../build/contracts/MarketPlace.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        storeFactoryInstance: null,
        storeInstances: [],
        storeNameList: [],
        web3: null,
        account: null,
        inputText: ''
      };
  
      this.handleChange = this.handleChange.bind(this)
      this.handleCreateStore = this.handleCreateStore.bind(this)
      this.handleAddStoreOwner = this.handleAddStoreOwner.bind(this)
      this.setStoreContract = this.setStoreContract.bind(this)
      this.getStoreName = this.getStoreName.bind(this)
      this.instantiateStoreContract = this.instantiateStoreContract.bind(this)
    }
  
    componentWillMount() {
      // Get network provider and web3 instance.
      // See utils/getWeb3 for more info.
  
      getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })
  
        // Instantiate contracts once web3 provided.
        this.setContracts()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
    }
  
    setContracts() {
      this.instantiateStoreFactoryContract()
      this.setStoreContract()
    }
  
    instantiateStoreFactoryContract() {
  
      const contract = require('truffle-contract')
      const storeFactory = contract(StoreFactoryContract)
      storeFactory.setProvider(this.state.web3.currentProvider)
  
      var storeFactoryCont
      // Get accounts.
      this.state.web3.eth.getAccounts((error, accounts) => {
        storeFactory.deployed().then((instance) => {
          storeFactoryCont = instance
          this.setState({storeFactoryInstance: instance, account: accounts[0]})
  
          return storeFactoryCont.getUserRole.call({from: accounts[0]})
        }).then((result) => {
          this.setState({ userRole: this.state.web3.toUtf8(result)} )
  
          return storeFactoryCont.getStores.call({from: accounts[0]})
        })
      })
    }
  
    setStoreContract() {
      const contract = require('truffle-contract')
      const store = contract(StoreContract)
  
      store.setProvider(this.state.web3.currentProvider)
      this.setState({ storeContract: store });
    }
  
    handleChange(e) {
      this.setState({ inputText: e.target.value });
    }
  
    handleAddStoreOwner() {
      this.state.storeFactoryInstance.addStoreOwner(this.state.inputText, { from: this.state.account })
    }
  
    handleCreateStore() {
      this.state.storeFactoryInstance.createStore(this.state.inputText, { from: this.state.account }).then((result) => {
        for (var i= 0; i< result.logs.length; i++) {
          var log = result.logs[i]
          console.log(log)
          if (log.event === "LogStoreCreated") {
            const storeAddress = log.args.store
  
            this.instantiateStoreContract(storeAddress)
          }
        }
      })
    }
  
    instantiateStoreContract(address) {
      const storeInstance = this.state.storeContract.at(address)
      let storesArray = this.state.storeInstances.concat( storeInstance )
      this.setState({ storeInstances: storesArray })
      this.getStoreName( storeInstance )
    }
  
    getStoreName(storeInstance) {
      console.log(storeInstance)
      storeInstance.getStoreName.call()
      .then((result) => {
        let storeName = this.state.web3.toUtf8(result)
        let storeNameArray = this.state.storeNameList.concat( storeName )
        this.setState({ storeNameList: storeNameArray })
      })
    }
  
    render() {
      const role = this.state.userRole
      let component
  
      if(role === 'admin') {
          component = <AdminComponent
            handleChange={this.handleChange}
            handleAddStoreOwner={this.handleAddStoreOwner}
          />
      } else if(role === 'storeOwner') {
          component = <StoreOwnerComponent
            handleChange={this.handleChange}
            handleCreateStore={this.handleCreateStore}
            storeInstances={this.state.storeInstances}
            storeNameList={this.state.storeNameList}
            getStoreName={this.getStoreName}
          />
      } else if(role === 'shopper') {
          component =
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h1>Welcome to the MarketPlace Shopper!</h1>
  
                <h2>Smart Contract Example</h2>
                <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
                <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
                <p>The stored value is: {this.state.userRole}</p>
              </div>
            </div>
          </main>
      }
  
      return(
        <div className="App">
  
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Market Place</a>
          </nav>
  
          {component}
  
        </div>
    );
  
    }
  }
  
  export default App

  render() {
    const role = this.state.userRole
    let component

    if(role === 'admin') {
        /*component = <AdminComponent
          handleChange={this.handleChange}
          handleAddStoreOwner={this.handleAddStoreOwner}
        />*/
    //} else if(role === 'storeOwner') {
        /*component = <StoreOwnerComponent
          handleChange={this.handleChange}
          handleCreateStore={this.handleCreateStore}
          storeInstances={this.state.storeInstances}
          storeNameList={this.state.storeNameList}
        />*/
    //} else if(role === 'shopper') {
        /*component = <ShopperComponent
          storeInstances={this.state.storeInstances}
          storeNameList={this.state.storeNameList}
        />*/
    /*}

    return(
      <div className="App">

        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Market Place</a>
        </nav>

        {component}

      </div>
  );

  }*/