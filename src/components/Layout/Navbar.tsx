import { Link } from '@tanstack/react-router';
import { WalletOptions } from '../wallet-options';
import { ConnectWallet } from '../connect-wallet';

const Navbar = () => {
  return (
    <div>
      <header className='fixed top-0 left-0 right-0 md:flex flex-col md:flex-row justify-between px-2 py-2 md:px-[8rem] md:py-[1.2rem] text-white shadow-lg bg-[#23054d] z-50'>
        <h1 className='text-3xl font-bold'>Remixcancu</h1>
        {/* navbar  */}{' '}
        <nav className='flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0'>
          {' '}
          <ul className='flex items-center justify-center space-x-6 capitalize '>
            {' '}
            <li>
              {' '}
              <Link
                to='https://nft-eight-eta.vercel.app'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                to='/'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
              >
                Collection
              </Link>
            </li>
            <li>
              <Link
                to='/'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
              >
                community
              </Link>
            </li>
            <li>
              <Link
                to='/'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
              >
                About
              </Link>
            </li>
            <li>
              {/* <WalletOptions/> */}
              <ConnectWallet/>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
