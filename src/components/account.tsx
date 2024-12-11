// import { useAccount, useDisconnect } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// export function Account() {
//   const { address } = useAccount();
//   const { disconnect } = useDisconnect();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="truncate">
//         {address?.slice(0, 6)}
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         {address && (
//           <DropdownMenuItem className="truncate">
//             {address}
//           </DropdownMenuItem>
//         )}
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={() => disconnect()}>
//           Disconnect
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div>
      {ensAvatar && <img alt='ENS Avatar' src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}

      <DropdownMenu>
        <DropdownMenuTrigger className='truncate'>
          {address?.slice(0, 6)}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {address && (
            <DropdownMenuItem className='truncate'>{address}</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <button onClick={() => disconnect()}>Disconnect</button> */}
    </div>
  );
}
