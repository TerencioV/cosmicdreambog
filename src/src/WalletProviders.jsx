import { useMemo } from "react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  GlyphProvider,
  glyphConnectorDetails,
  glyphWalletRK,
  StrategyType,
  WalletClientType,
  useGlyphConfigureDynamicChains
} from "@use-glyph/sdk-react";

// Your Reown/WalletConnect Cloud project ID.
// Get / rotate this at https://dashboard.reown.com
export const WALLETCONNECT_PROJECT_ID = "e9304fee8b4533fd07f744a448681895";

const queryClient = new QueryClient();

// Wallet groups shown in the RainbowKit connect modal:
// - Glyph's own wallet (email/social embedded wallet, no extension needed)
// - RainbowKit's normal default set (MetaMask, Coinbase Wallet, WalletConnect, etc.)
const connectors = connectorsForWallets(
  [
    {
      groupName: glyphConnectorDetails.name,
      wallets: [glyphWalletRK]
    }
  ],
  {
    appName: "Cosmic Dream Bog",
    projectId: WALLETCONNECT_PROJECT_ID
  }
);

function WagmiRoot({ children }) {
  // Chains come dynamically from Glyph's backend (always includes ApeChain).
  const { chains } = useGlyphConfigureDynamicChains();

  const wagmiConfig = useMemo(() => {
    if (!chains || chains.length === 0) return null;
    return createConfig({
      chains,
      transports: chains.reduce((acc, chain) => {
        acc[chain.id] = http();
        return acc;
      }, {}),
      connectors
    });
  }, [chains]);

  if (!wagmiConfig) return null;

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}

/**
 * Shared provider stack for every page that needs wallet connection:
 * wagmi (dynamic Glyph-supplied chains) -> react-query -> RainbowKit -> Glyph.
 * Use the SAME stack on every page so a connection made on one page
 * (e.g. index.html) is recognized on another (e.g. journey.html).
 */
export default function WalletProviders({ children }) {
  return (
    <WagmiRoot>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <GlyphProvider
            strategy={StrategyType.EIP1193}
            walletClientType={WalletClientType.RAINBOWKIT}
            askForSignature={true}
          >
            {children}
          </GlyphProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiRoot>
  );
}
