import { BrowserProvider, Contract, parseEther } from "ethers";
import {
  CONTRACT_ADDRESS,
  FUJI_CHAIN_ID_DEC,
  FUJI_RPC,
  MINT_PRICE_AVAX,
} from "./config.js";

// The contract's "menu" — the functions the mint page needs.
const ABI = [
  "function mint(address to, uint256 qty) external payable",
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
];

export function getProvider() {
  if (!window.ethereum) throw new Error("NO_WALLET");
  return new BrowserProvider(window.ethereum);
}

export async function connectWallet() {
  const provider = getProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}

export async function getChainId() {
  const provider = getProvider();
  const hex = await provider.send("eth_chainId", []);
  return parseInt(hex, 16);
}

export async function switchToFuji() {
  const provider = getProvider();
  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0xa869" }, // 43113 in hex
    ]);
  } catch (err) {
    // 4901 = chain not added yet → add it
    if (err?.code === 4901 || err?.data?.originalError?.code === 4901) {
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: "0xa869",
          chainName: "Avalanche Fuji Testnet",
          nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
          rpcUrls: [FUJI_RPC],
          blockExplorerUrls: ["https://testnet.snowtrace.io"],
        },
      ]);
    } else {
      throw err;
    }
  }
}

export function getContract(signer) {
  return new Contract(CONTRACT_ADDRESS, ABI, signer);
}

export async function mint(recipient, qty) {
  const provider = getProvider();
  const signer = await provider.getSigner();
  const tx = await getContract(signer).mint(recipient, qty, {
    value: parseEther(String(Number(MINT_PRICE_AVAX) * qty)),
  });
  await tx.wait(); // confirmed on-chain
  return tx.hash;
}

export function shortAddress(addr) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

export { FUJI_CHAIN_ID_DEC };
