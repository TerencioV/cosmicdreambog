import { useEffect, useRef } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { apeChain } from "viem/chains";
import WalletProviders from "./WalletProviders.jsx";

/**
 * Watches the wagmi connection state and reproduces the site's existing
 * post-connect behavior: force the session onto ApeChain, remember the
 * wallet in sessionStorage, then send the visitor to journey.html.
 */
function ConnectWatcher() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!isConnected || !address || handledRef.current) return;

    const finish = async () => {
      handledRef.current = true;

      try {
        if (chainId !== apeChain.id) {
          await switchChainAsync({ chainId: apeChain.id });
        }
      } catch (err) {
        console.error("Chain switch failed", err);
      }

      sessionStorage.setItem("cosmicDreamWallet", address);
      sessionStorage.removeItem("bogVoyagerManualDisconnect");

      window.location.href = "journey.html";
    };

    finish();
  }, [isConnected, address, chainId, switchChainAsync]);

  return null;
}

/** Bridges RainbowKit's connect-modal opener out to the plain HTML hotspot button. */
function ModalBridge() {
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    window.__cdbOpenWalletModal = () => {
      if (openConnectModal) {
        openConnectModal();
      } else {
        alert("Wallet connection is still loading — try again in a second.");
      }
    };

    return () => {
      delete window.__cdbOpenWalletModal;
    };
  }, [openConnectModal]);

  return null;
}

export default function WalletApp() {
  return (
    <WalletProviders>
      <ModalBridge />
      <ConnectWatcher />
    </WalletProviders>
  );
}
