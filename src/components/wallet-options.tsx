import { useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <button onClick={() => connect({ connector: connectors[2] })}>
      Connect Wallet
    </button>
  );
}
