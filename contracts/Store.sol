pragma solidity ^0.4.21;

import "./openzeppelin-solidity/Pausable.sol";
import "./openzeppelin-solidity/Ownable.sol";
import "./openzeppelin-solidity/SafeMath.sol";

/** @title Store */
contract Store is Ownable, Pausable {
    using SafeMath for uint256; 

    ///State

    string public storeName;
    uint256 public storeBalance;

    mapping(uint256 => Product) public products;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        uint256 stock;
    }

    ///Events 
    
    event ProductAdded(uint256 id);
    event ProductRemoved(uint256 id, uint256 stock);
    
    event StockUpdated(uint256 id, uint256 stock);
    event StockAvaiable(bool available);
    
    event Purchase(uint256 id, uint256 stock);
    event WithdrawCorrectly(uint256 balance);

    ///Functions

    /**
    * @notice Constructor
    * @param _storeOwner Address of the owner of the Store
    * @param _storeName Name of the store
    */
    constructor(address _storeOwner, string _storeName) public {
        owner = _storeOwner;
        storeName = _storeName;
    }
    
    /**
    * @notice Add new product to the Store
    * @param id Identification of the new prodcut
    * @param name Name of the new product
    * @param price Price of the new product
    * @param stock Stock of the new product
    */
    function addProduct(uint256 id, string name, uint256 price, uint256 stock) public onlyOwner whenNotPaused returns (bool success) {
        Product memory newProduct = Product(id, name, price, stock);
        bytes memory temp = bytes(newProduct.name);
        if (newProduct.price > 0 && temp.length != 0) {
            products[id] = newProduct;
            emit ProductAdded(id);
            return true;
        }
        return false;
    }

    /**
    * @notice Add stock for a product of the Store
    * @param id Identification of the prodcut
    * @param amount Amount of stock to add
    */
    function addStock(uint256 id, uint256 amount) public onlyOwner whenNotPaused returns (bool success) {
        products[id].stock = products[id].stock.add(amount);
        emit StockUpdated(id, products[id].stock);
        return true;
    }

    /**
    * @notice Check stock avaiable
    * @param id Identification of the prodcut
    * @param needed Stock needed
    */
    function checkStock(uint256 id, uint256 needed) public onlyOwner whenNotPaused returns(bool available) {
        if (products[id].stock >= needed) {
            emit StockAvaiable(true);
            return true;
        }
        emit StockAvaiable(false);
        return false;
    }

    /**
    * @notice Remove product of the Store
    * @param id Identification of the prodcut
    * @param amount Amount of stock to remove
    */
    function removeStock(uint256 id, uint256 amount) public onlyOwner whenNotPaused returns (bool success){
        products[id].stock = products[id].stock.sub(amount);
        emit ProductRemoved(id, products[id].stock);
        return true;
    }
    
    /**
    * @notice Pay for a product
    * @param id Identification of the prodcut
    * @param amount Amount of products
    */
    function payProducts(uint256 id, uint256 amount) public payable whenNotPaused returns (bool success) {
        uint256 totalPrice = products[id].price.mul(amount);
        if (msg.value >= totalPrice && products[id].stock >= amount) {
            products[id].stock = products[id].stock.sub(amount);
            storeBalance = storeBalance.add(msg.value);
            emit Purchase(id, products[id].stock);
            return true;
        }
        return false;
    }
    
    /**
    * @dev Withdraw store balance
    */
    function withdraw(uint256 amount) public onlyOwner {
        assert(storeBalance >= amount);
        storeBalance = storeBalance.sub(amount);
        owner.transfer(amount);
        emit WithdrawCorrectly(amount);
    }


    /**
    * @notice Get product
    * @param id Identification of the prodcut
    */
    function getProduct(uint256 id) public view returns (string name, uint256 price, uint256 stock) {
        return (products[id].name, products[id].price, products[id].stock);
    }
    
    function() public payable {
        revert();
    }
    
}