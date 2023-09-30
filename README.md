# NFT-Minter-Bcnmy
In this tutorial we'll be minting an NFT by paying gas fees in USDC - This your guide to gasless + easy NFT minting using Biconomy SDK .

We start with setup, then do a gasless NFT mint follwed by NFT minting with ability to pay gasfees through USDC. All of our transactions would actually happen through a smart contract wallet.

## Let's setup the environment
Clone this biconomy repo for getting the base project

```git clone https://github.com/bcnmy/quickstart```

Navigate tothe directory and run npm install OR yarn install

``` cd quickstart```

```npm install or yarn install```
    
Next, add your private key in a .env file in the root directory

```PRIVATE_KEY = "enter some private key"```
    
Next, we'll set up our node js script to create a smart account.
<TBD>
    
NOTE: This script is a starter code for setting up the biconomy SDK and **setting up our Smart contract account for gasless minting. and minting NFT by paying gas fees in USDC.** After running this script using ```npm run dev```, you will see :
        1. The owner of the smart account which is the address associated to your private key, 
        2. And the address of your smart account.
