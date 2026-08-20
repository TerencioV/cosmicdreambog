import { useEffect, useRef } from "react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { apeChain } from "viem/chains";
import WalletProviders from "./WalletProviders.jsx";

function shortenAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function JourneyStatus() {
  const { address, isConnected, chainId } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const chainSwitchedRef = useRef(false);

  useEffect(() => {
    const walletAddressEl = document.getElementById("walletAddress");
    const statusDotEl = document.getElementById("statusDot");
    if (!walletAddressEl || !statusDotEl) return;

    if (isConnected && address) {
      walletAddressEl.textContent = shortenAddress(address);
      statusDotEl.classList.add("connected");

      sessionStorage.setItem("cosmicDreamWallet", address);
      sessionStorage.removeItem("bogVoyagerManualDisconnect");
    } else {
      walletAddressEl.textContent = "DISCONNECTED";
      statusDotEl.classList.remove("connected");

      sessionStorage.removeItem("cosmicDreamWallet");
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (!isConnected || chainSwitchedRef.current) return;
    if (chainId === apeChain.id) return;

    chainSwitchedRef.current = true;
    switchChainAsync({ chainId: apeChain.id }).catch((err) => {
      console.error("Chain switch failed", err);
    });
  }, [isConnected, chainId, switchChainAsync]);

  useEffect(() => {
    window.__cdbToggleWallet = async () => {
      if (isConnected) {
        sessionStorage.setItem("bogVoyagerManualDisconnect", "true");
        try {
          await disconnectAsync();
        } catch (err) {
          console.error("Disconnect failed", err);
        }
        window.location.href = "index.html";
      } else if (openConnectModal) {
        openConnectModal();
      } else {
        alert("Wallet connection is still loading — try again in a second.");
      }
    };

    return () => {
      delete window.__cdbToggleWallet;
    };
  }, [isConnected, disconnectAsync, openConnectModal]);

  return null;
}

export default function JourneyApp() {
  return (
    <WalletProviders>
      <JourneyStatus />
    </WalletProviders>
  );
}