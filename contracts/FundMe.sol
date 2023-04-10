// Get fund from users
// withdraw funds
// set a min funding value

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol"; 


error FundMe__NotOwner(); 

/**@title A sample Funding Contract
 * @author Yash Mittal
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */


contract FundMe{ 
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
     //state variables
    address[] private  s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;   //storage vari ton of gas
    address private immutable i_owner;   // set immutable because it is set one time but outside of where it is declared which is in constructor
    
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress){
        i_owner=msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

      receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }


    function fund() public payable{
        // set min min fund amt in USD
        //require(msg.sender == owner, "Sender is not Owner");
        //require(getConversionRate(msg.value) >= minimumUsd, "Ayo, stingy arse!");  // 1e18 == 1 eth , we want min 1 eth donation
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "Ayo, stingy arse!");       
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
        }
            

    function withdraw() public onlyOwner{
        // for loop
        for(uint256 funderIndex =0; funderIndex < s_funders.length; funderIndex = funderIndex +1){

                address funder =s_funders[funderIndex];
                s_addressToAmountFunded[funder] = 0;


        }
        //reset the array
        s_funders = new address[](0);

        //actually withdraw
        //transfer
        // msg.sender = address
        // payable(msg.sender) = payable address
        payable(msg.sender).transfer(address(this).balance);

        //send
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send Failed");
  
        //call
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");

    }
    function cheaperWithdraw() public payable onlyOwner{
        address[] memory funders = s_funders;
        // mappings can't be in memory
        for(uint256 funderIndex =0; funderIndex< funders.length; funderIndex++){
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder]=0;

        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);


    }

    modifier onlyOwner {
        //require(msg.sender == i_owner, "Sender is not Owner");
        if(msg.sender != i_owner) { revert FundMe__NotOwner(); }
        _; //do the rest of the code
    }

    function getOwner() public view returns(address){
    return i_owner;
}
function getFunder(uint256 index) public view returns(address){
    return s_funders[index];
}
function getAddressToAmountFunded(address funder) public view returns(uint256){
    return s_addressToAmountFunded[funder];
}
function getPriceFeed() public view returns(AggregatorV3Interface){
    return s_priceFeed;
}
     
}