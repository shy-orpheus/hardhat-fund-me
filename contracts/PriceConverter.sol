// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
//import"node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"


library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        // ABI
        // //ADDRESS  0x694AA1769357215DE4FAC081bf1f309aDC325306
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x694AA1769357215DE4FAC081bf1f309aDC325306
        // );        <<<<==== no longer need these lines!!!!!!
        (, int price, , , ) = priceFeed.latestRoundData(); // as opposed to  (uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound)
        // ETH in terms of usd
        return uint(price * 1e10);
    }


    function getConversionRate(
        uint256 ethAmount, AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountUsd;
    }
}
