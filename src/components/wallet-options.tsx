import { useConnect } from 'wagmi';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <button
      className='bg-gray text-white rounded-full p-2 px-6 bg-[#2F80ED] hover:bg-white hover:text-[#2F80ED] transition duration-300 '
      onClick={() => connect({ connector: connectors[2] })}
    >
      Connect Wallet
    </button>
  );
}
