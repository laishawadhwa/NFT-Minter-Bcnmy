
import { config } from "dotenv"
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { Wallet, providers, ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto, 
} from '@biconomy/paymaster'

config()



const bundler: IBundler = new Bundler({
    bundlerUrl:
        "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl:
        "https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a",
});

const provider = new providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai"
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

const module = await ECDSAOwnershipValidationModule.create({
  signer: wallet,
  moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
})

let smartAccount: BiconomySmartAccountV2
let address: string

async function createAccount() {
  console.log("creating address")
  let biconomySmartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler,
    paymaster: paymaster, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module
})
  address = await biconomySmartAccount.getAccountAddress()
  smartAccount = biconomySmartAccount;
  return biconomySmartAccount;
}

async function mintNFT() {
    await createAccount();
    const nftInterface = new ethers.utils.Interface([
        "function safeMint(address _to)",
    ]);

    const data = nftInterface.encodeFunctionData("safeMint", [address]);

    const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

    const transaction = {
        to: nftAddress,
        data: data,
    };

    console.log("creating nft mint userop");
    let partialUserOp = await smartAccount.buildUserOp([transaction]);

    const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

    let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: 'BICONOMY',
          version: '2.0.0'
        },
    };
    console.log("getting paymaster and data");
    try {
        const paymasterAndDataResponse =
            await biconomyPaymaster.getPaymasterAndData(
                partialUserOp,
                paymasterServiceData
            );
        partialUserOp.paymasterAndData =
            paymasterAndDataResponse.paymasterAndData;
    } catch (e) {
        console.log("error received ", e);
    }
    console.log("sending userop");
    try {
        const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
        const transactionDetails = await userOpResponse.wait();
        console.log(
            `transactionDetails: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`
        );
        console.log(
            `view minted nfts for smart account: https://testnets.opensea.io/${address}`
        );
    } catch (e) {
        console.log("error received ", e);
    }
}

mintNFT();