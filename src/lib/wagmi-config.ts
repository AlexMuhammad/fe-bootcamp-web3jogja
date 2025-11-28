import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia, base } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Web3 Jogja Vault",
  projectId: "3fcc6bba6f1de962d911bb5b5c3dba68",
  chains: [baseSepolia, base],
  ssr: true,
});
