import React, { Component } from 'react'
import MarketPlaceContract from '../build/contracts/MarketPlace.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

//import {AdminComponent} from './components/AdminComponent.js'
//import {StoreOwnerComponent} from './components/StoreOwnerComponent.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      marketPlaceContract: null,
      web3: null,
      coinbase: null
    };

    this.handleChange = this.handleChange.bind(this);
    //this.handleAddStore = this.handleCreateStore.bind(this);
    //this.handleAddStoreOwner = this.handleAddStoreOwner.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const marketPlace = contract(MarketPlaceContract)
    marketPlace.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on StoreFactory.
    var marketPlaceInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, _accounts) => {
      marketPlace.deployed().then((instance) => {
        marketPlaceInstance = instance
        this.setState({marketPlaceContract: instance, accounts: _accounts});

        return marketPlaceInstance.getUserRole.call({from: _accounts[0]});
      }).then((result) => {

        return this.setState({ userRole: this.state.web3.toUtf8(result)} );
      })
    })
  }

  handleChange(e) {
    this.setState({ inputText: e.target.value });
  }

  /*handleCreateStore(storeName) {
    this.state.storeFactoryContract.createStore(storeName, { from: theCoinbase })
  }

  handleAddStoreOwner(address) {
    this.state.storeFactoryContract.addStoreOwner(address, { from: this.state.accounts[0] })
  }*/

  render() {
    const role = this.state.userRole;
    let component;

    if(role === 0) {
        //component = <AdminComponent/>
    } else if(role === 1) {
        //component = <StoreOwnerComponent/>
    } else if(role === 2) {
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