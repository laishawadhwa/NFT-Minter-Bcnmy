console.log("Hello World!")
import { IBundler, Bundler } from '@biconomy/bundler';
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { providers } from 'ethers';
import { ChainId } from "@biconomy/core-types";
import { BiconomySmartAccount, BiconomySmartAccountConfig } 
from "@biconomy/account";
import { Wallet } from 'ethers';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';

// Import dotenv and load environment variables
import { config } from "dotenv";
config();

async function main() {
    // Initialize bundler
    const bundler: IBundler = new Bundler({
        bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44', // Replace with your bundler URL
        chainId: ChainId.POLYGON_MUMBAI,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });

    // Initialize provider and wallet
    const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai");
    const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

    // Initialize paymaster
    const paymaster: IPaymaster = new BiconomyPaymaster({
        paymasterUrl: 'https://paymaster.biconomy.io/api/v1/80001/WJpOe4VgM.0db762d2-d21c-480f-a781-ba5c9c8f217f' // Replace with your paymaster URL
    });

    // Configure Biconomy Smart Account
    const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: wallet,
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster
    };

    // Create Biconomy Smart Account
    const biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
    await biconomySmartAccount.init();

    // Log smart account details
    console.log("Smart Account Owner:", biconomySmartAccount.owner);
    console.log("Smart Account Address:", await biconomySmartAccount.getSmartAccountAddress());
}

// Run the main function
main();