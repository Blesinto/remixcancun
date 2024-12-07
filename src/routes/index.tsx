import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader, Loader2, Plus, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { isAddress } from 'ethers';
import { readContract } from '@wagmi/core';
import { config } from '@/lib/wagmi';
import { remixCancunNftAbi } from '@/generated';

const CONTRACT_ADDRESS = '0x1139f0977E435A12c511718Ba883b998B81aFB05';
const CONTRACT_ABI = remixCancunNftAbi;

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { address: currentAccount } = useAccount();
  const { writeContract } = useWriteContract();
  const [tokenURI, setTokenURI] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<
    { tokenId: number; uri: string }[]
  >([]);

  const {
    data: balance,
    isLoading: fetchingBalanceNFTs,
    refetch: refetchBalanceNFTs,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [currentAccount!],
  });

  const {
    isLoading: waitingForTxn,
    isSuccess: txIsSuccess,
    isError: txIsError,
    error: txError,
  } = useWaitForTransactionReceipt();

  // Fetch owned NFTs
  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!currentAccount) return;

      try {
        // Brute force search for owned NFTs (less efficient)
        const nfts: { tokenId: number; uri: string }[] = [];

        if (balance) {
          for (let tokenId = BigInt(0); tokenId < balance; tokenId++) {
            // Multiplied by 2 to ensure coverage
            try {
              const owner = await readContract(config, {
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'ownerOf',
                args: [tokenId],
              });

              if (
                owner &&
                owner?.toLowerCase() === currentAccount.toLowerCase()
              ) {
                const uri = await readContract(config, {
                  address: CONTRACT_ADDRESS,
                  abi: CONTRACT_ABI,
                  functionName: 'tokenURI',
                  args: [tokenId],
                });
                nfts.push({
                  tokenId: Number(BigInt(balance).toString(10)),
                  uri,
                });
              }
            } catch (err) {
              // Token likely doesn't exist, continue searching
              continue;
            }
          }
        }

        setOwnedNFTs(nfts);
      } catch (err) {
        setError('Failed to fetch NFTs');
      }
    };

    fetchOwnedNFTs();
  }, [currentAccount]);

  const handleMintNFT = async () => {
    if (!currentAccount || !tokenURI) return;

    try {
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'mintNFT',
          args: [currentAccount, tokenURI],
        },
        {
          onSuccess: () => {
            refetchBalanceNFTs();
          },
          onError: error => {
            setError('Failed to mint NFT: ' + error.message);
          },
        }
      );
    } catch (error) {
      setError('Failed to mint NFT: ' + (error as Error).message);
    }
  };

  const handleTransferNFT = async () => {
    if (!selectedTokenId || !transferAddress || !isAddress(transferAddress))
      return;

    try {
      // Fetch current owner of the token
      const currentOwner = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'ownerOf',
        args: [BigInt(selectedTokenId)],
      });

      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'transferFrom',
          // @ts-expect-error transferAddress
          args: [currentOwner, transferAddress, BigInt(selectedTokenId)],
        },
        {
          onSuccess: () => {
            setTransferAddress('');
            refetchBalanceNFTs();
          },
          onError: error => {
            setError('Failed to transfer NFT: ' + error.message);
          },
        }
      );
    } catch (error) {
      setError('Failed to transfer NFT: ' + (error as Error).message);
    }
  };

  return (
    <main className='container mx-auto p-4 space-y-4'>
      {!currentAccount ? (
        <Card>
          <CardContent className='flex items-center justify-center p-6'>
            <p className='text-gray-500'>Connect your wallet</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mint NFT Card */}
          <Card>
            <CardHeader>
              <CardTitle>Mint NFT</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder='Token URI'
                value={tokenURI}
                onChange={e => setTokenURI(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleMintNFT} disabled={!tokenURI}>
                <Plus className='mr-2 h-4 w-4' /> Mint
              </Button>
            </CardFooter>
          </Card>

          {/* Owned NFTs */}
          <Card>
            <CardHeader>
              <CardTitle>Your NFTs</CardTitle>
            </CardHeader>
            <CardContent>
              {fetchingBalanceNFTs || waitingForTxn ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className='animate-pulse'>
                      <CardContent className='p-4'>
                        <div className='w-full h-40 bg-gray-200 rounded-lg mb-2'></div>
                        <div className='h-4 bg-gray-200 rounded w-2/3 mb-2'></div>
                        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : ownedNFTs.length === 0 ? (
                <div className='text-center p-4'>No NFTs found</div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {ownedNFTs.map((nft, index) => (
                    <Card
                      key={`nft ${nft.tokenId}-${index}`}
                      onClick={() => setSelectedTokenId(nft.tokenId)}
                      className={`cursor-pointer ${selectedTokenId === nft.tokenId ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <CardContent className='p-4'>
                        <img
                          src={nft.uri || '/api/placeholder/200/200'}
                          alt={`nft ${nft.tokenId}-${index}`}
                          className='w-full h-40 object-cover rounded-lg mb-2'
                        />
                        <h3 className='font-semibold'>
                          Token ID: {nft.tokenId}
                        </h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => refetchBalanceNFTs()}
                disabled={fetchingBalanceNFTs || waitingForTxn}
              >
                <Loader2
                  className={`mr-2 h-4 w-4 ${fetchingBalanceNFTs || waitingForTxn ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </CardFooter>
          </Card>

          {/* Transfer NFT */}
          {selectedTokenId !== null && (
            <Card>
              <CardHeader>
                <CardTitle>Transfer NFT</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder='Recipient Address'
                  value={transferAddress}
                  onChange={e => setTransferAddress(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleTransferNFT}
                  disabled={!isAddress(transferAddress)}
                >
                  <Send className='mr-2 h-4 w-4' /> Transfer
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Error and Transaction Status Display */}
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fetchingBalanceNFTs ||
            (waitingForTxn && (
              <Alert variant='default'>
                <Loader className='mr-2 h-4 w-4 animate-spin' />
                <AlertDescription>
                  {fetchingBalanceNFTs
                    ? 'Fetching owned NFTs...'
                    : 'Transaction in progress...'}
                </AlertDescription>
              </Alert>
            ))}

          {/* Error Handling */}
          {txIsSuccess && (
            <Alert variant='default'>
              <AlertDescription>Transaction successful!</AlertDescription>
            </Alert>
          )}

          {txIsError && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Transaction Error</AlertTitle>
              <AlertDescription>{txError?.message}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </main>
  );
}

export default Index;
