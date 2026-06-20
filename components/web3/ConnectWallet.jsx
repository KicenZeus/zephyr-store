'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getHardhatWallet } from '@/lib/hardhat-wallet';

// Hardhat Local Network Configuration (chainId 31338 → hex 0x7A6A)
const HARDHAT_NETWORK = {
  chainId: '0x7A6A',
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8546'],
};

export default function ConnectWallet() {
  const [address, setAddress] = useState(null);
  const [localError, setLocalError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);
        if (profileData?.wallet_address) {
          setAddress(profileData.wallet_address);
        }
      }
    };
    init();
  }, [supabase]);

  // Auto connect MetaMask when user is logged in and profile exists
  useEffect(() => {
    if (!mounted || !user || !profile?.wallet_address) return;
    if (metaMaskConnected) return; // Already connected

    const autoConnect = async () => {
      try {
        if (!window.ethereum) {
          setLocalError('MetaMask tidak terinstall!');
          return;
        }

        // Try to get accounts, if not connected then request
        let accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length === 0) {
          // Request connection if not already connected
          accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
        }
        
        if (accounts.length > 0) {
          setMetaMaskAddress(accounts[0]);
          setMetaMaskConnected(true);

          // Switch to Hardhat network
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: HARDHAT_NETWORK.chainId }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: HARDHAT_NETWORK.chainId,
                    chainName: HARDHAT_NETWORK.chainName,
                    nativeCurrency: HARDHAT_NETWORK.nativeCurrency,
                    rpcUrls: HARDHAT_NETWORK.rpcUrls,
                  },
                ],
              });
            }
          }
        }
      } catch (err) {
        console.error('Auto connect MetaMask error:', err);
        setLocalError(''); // Ignore auto connect errors
      }
    };

    autoConnect();
  }, [mounted, user, profile, metaMaskConnected]);

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Address copied!');
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        Login untuk melihat wallet
      </div>
    );
  }

  if (!profile?.wallet_address) {
    return (
      <div className="flex items-center gap-2 text-xs text-yellow-400">
        Wallet belum tersedia
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-zinc-800/50 border border-white/10 px-4 py-2 rounded-2xl">
      {/* Connection Indicator */}
      <span className={`w-3 h-3 rounded-full ${metaMaskConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
      
      {/* Wallet Badge */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-xs font-black text-white">
        {profile?.wallet_index === 0 ? 'ADM' : `#${profile.wallet_index}`}
      </div>
      
      {/* Wallet Info */}
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white">{shortenAddress(profile.wallet_address)}</span>
        <span className="text-[10px] text-zinc-500">{profile.wallet_index === 0 ? 'Admin Wallet' : 'User Wallet'}</span>
      </div>
      
      {/* Copy Button */}
      <button
        onClick={() => copyToClipboard(profile.wallet_address)}
        className="ml-auto p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        title="Copy Address"
      >
        📋
      </button>
    </div>
  );
}
