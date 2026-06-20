'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import { useState, useEffect } from 'react';
import contractData from '@/app/contracts/TopUpPayment.json';

export default function Web3Transactions() {
  const [address, setAddress] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const contractDeployed = contractData.address && contractData.address !== '0x0000000000000000000000000000000000000000';

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            loadTransactions(accounts[0]);
          }
        })
        .catch(() => {});

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          loadTransactions(accounts[0]);
        } else {
          setAddress(null);
          setTransactions([]);
        }
      });
    }
  }, []);

  const loadTransactions = async (userAddress) => {
    if (!window.ethereum || !contractDeployed) return;
    
    setIsLoading(true);
    try {
      // For now, we'll use a simple approach - we can't easily read the contract without ethers
      // So we'll just show a placeholder for transactions
      setTransactions([]);
    } catch (e) {
      console.error('Error loading transactions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic mb-2">On-Chain Transactions</h1>
          <p className="text-zinc-500 text-sm">Your Web3 transaction history</p>
        </div>

        {!address ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-zinc-500 mb-4">Connect your wallet to view transactions</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-zinc-500">Loading transactions...</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📜</div>
            <p className="text-zinc-500 mb-4">Transaction history will appear here after your first payment!</p>
            <p className="text-xs text-zinc-600">Check your MetaMask Activity tab for transaction details</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
