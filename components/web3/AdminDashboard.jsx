'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractData from '@/app/contracts/TopUpPayment.json';

const CONTRACT_ADDRESS = contractData.address;
const CONTRACT_ABI = contractData.abi;

export default function AdminDashboard() {
  const [contractBalance, setContractBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadContractBalance();
  }, []);

  const loadContractBalance = async () => {
    try {
      if (!window.ethereum) return;
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      setContractBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('Load balance error:', err);
    }
  };

  const withdraw = async () => {
    try {
      setLoading(true);
      setStatus('Processing...');
      
      if (!window.ethereum) {
        setStatus('MetaMask tidak terinstall!');
        setLoading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.withdraw();
      setStatus('Transaction sent: ' + tx.hash);
      
      await tx.wait();
      setStatus('Withdraw successful!');
      
      // Refresh balance
      await loadContractBalance();
    } catch (err) {
      console.error('Withdraw error:', err);
      setStatus('Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-zinc-800/50 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-black text-white mb-4">👑 Admin Dashboard</h3>
      
      <div className="space-y-4">
        <div className="bg-zinc-900/50 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase font-black mb-1">Contract Balance</p>
          <p className="text-2xl font-black text-white">{contractBalance} ETH</p>
        </div>

        <button
          onClick={withdraw}
          disabled={loading || contractBalance === '0.0'}
          className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
            loading || contractBalance === '0.0'
              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
          }`}
        >
          {loading ? 'Processing...' : 'Withdraw All ETH'}
        </button>

        {status && (
          <p className={`text-xs font-bold ${status.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {status.includes('Error') ? '❌ ' : '✅ '}{status}
          </p>
        )}

        <button
          onClick={loadContractBalance}
          className="w-full py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          🔄 Refresh Balance
        </button>
      </div>
    </div>
  );
}
