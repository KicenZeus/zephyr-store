'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import contractData from '@/app/contracts/TopUpPayment.json';
import { createClient } from '@/lib/supabase/client';

// Fungsi untuk menghitung hash (sama dengan di halaman transaksi!)
function calculateTransactionHash(tx) {
  const prevHashToUse = tx.prev_hash;
  const userIdStr = String(tx.user_id).toLowerCase();
  const amountStr = String(tx.amount);
  const nonceStr = String(tx.nonce);

  // Format created_at sama dengan di SQL!
  const createdAtForHash = tx.created_at.replace("T", " ").replace(/:00$/, "");

  const data = 
    tx.id + "|" + 
    userIdStr + "|" + 
    tx.game + "|" + 
    tx.item + "|" + 
    amountStr + "|" + 
    createdAtForHash + "|" + 
    prevHashToUse + "|" + 
    nonceStr;

  return new Promise(async (resolve) => {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      resolve(hashHex);
    } catch (e) {
      console.error("Error calculating hash:", e);
      resolve(null);
    }
  });
}

const HARDHAT_CHAIN_ID = '0x7a6a'; // 31338 in hex

export default function AdminPage() {
  const [status, setStatus] = useState('idle');
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});
  const supabase = createClient();

  const isCorrectNetwork = chainId === HARDHAT_CHAIN_ID;

  // Format balance with thousand separator and remove trailing zeros
  const formatBalance = (balance) => {
    const zphBalance = Number(balance) / 1e18;
    const [integerPart, decimalPart] = zphBalance.toFixed(4).split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    return trimmedDecimal ? `${formattedInteger},${trimmedDecimal}` : formattedInteger;
  };

  // Get contract balance
  const fetchContractBalance = async () => {
    try {
      if (!window.ethereum || !contractData.address) return;
      
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [contractData.address, 'latest'],
      });
      
      setContractBalance(balance);
    } catch (err) {
      console.error('Error fetching contract balance:', err);
    }
  };

  // Check if current wallet is owner
  const checkOwner = async () => {
    try {
      if (!window.ethereum || !address || !contractData.address) return;
      
      // Call owner() function on contract
      const ownerAddress = await window.ethereum.request({
        method: 'eth_call',
        params: [
          {
            to: contractData.address,
            data: '0x8da5cb5b', // owner() function selector
          },
          'latest',
        ],
      });
      
      // Convert to address format (remove leading zeros)
      const owner = '0x' + ownerAddress.slice(-40).toLowerCase();
      const currentAddress = address.toLowerCase();
      
      setIsOwner(owner === currentAddress);
    } catch (err) {
      console.error('Error checking owner:', err);
      setIsOwner(false);
    }
  };

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get user name by user_id
  const getUserName = (userId) => {
    const profile = profiles.find(p => p.id === userId);
    return profile?.name || 'Unknown User';
  };

  // Fungsi untuk memverifikasi semua transaksi
  const verifyAllTransactions = async (txs) => {
    const newStatus = {};
    for (const tx of txs) {
      if (tx.block_hash) {
        const calculatedHash = await calculateTransactionHash(tx);
        newStatus[tx.id] = calculatedHash === tx.block_hash;
      } else {
        newStatus[tx.id] = null;
      }
    }
    setVerificationStatus(newStatus);
  };

  // State untuk error fetching
  const [fetchError, setFetchError] = useState(null);

  // Fetch all transactions from Supabase
  const fetchAllTransactions = async () => {
    try {
      setFetchError(null);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          transaction_hashes (
            block_hash,
            prev_hash,
            nonce,
            block_height
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching transactions:', error);
        setFetchError(error.message);
        return;
      }
      
      // Gabungkan data hash ke transaksi (transaction_hashes adalah OBJECT, bukan array!)
          const dataWithHash = (data || []).map(tx => ({
            ...tx,
            block_hash: tx.transaction_hashes?.block_hash,
            prev_hash: tx.transaction_hashes?.prev_hash,
            nonce: tx.transaction_hashes?.nonce,
            block_height: tx.transaction_hashes?.block_height
          }));
      
      setTransactions(dataWithHash);
      // Verifikasi semua transaksi
      verifyAllTransactions(dataWithHash);
    } catch (err) {
      console.error('❌ Error fetching transactions:', err);
      setFetchError(err.message);
    }
  };

  // Fetch all profiles from Supabase
  const fetchAllProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name');
      
      if (error) {
        console.error('❌ Error fetching profiles:', error);
        return;
      }
      
      setProfiles(data || []);
    } catch (err) {
      console.error('❌ Error fetching profiles:', err);
    }
  };

  // Withdraw all balance from contract
  const handleWithdraw = async () => {
    if (!address) {
      alert('Silakan hubungkan wallet terlebih dahulu!');
      return;
    }

    if (!isOwner) {
      alert('Anda bukan owner dari kontrak ini!');
      return;
    }

    // Check if contract has balance
    if (contractBalance === '0' || contractBalance === '0x0' || BigInt(contractBalance) === 0n) {
      alert('Kontrak tidak memiliki saldo untuk di-withdraw! Lakukan transaksi terlebih dahulu.');
      return;
    }

    setStatus('awaiting');
    setErrorMsg('');

    try {
      // Call withdraw() function on contract
      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            to: contractData.address,
            from: address,
            data: '0x3ccfd60b', // withdraw() function selector
          },
        ],
      });

      console.log('✅ Withdraw transaction sent:', tx);
      setStatus('pending');

      // Wait for transaction receipt
      let receipt = null;
      let attempts = 0;
      while (!receipt && attempts < 60) {
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [tx],
          });
        } catch (e) {
          console.warn('⚠️ Error getting receipt (will retry):', e);
        }
        await new Promise(r => setTimeout(r, 1000));
        attempts++;
      }

      if (receipt && (receipt.status === '0x1' || receipt.status === 1)) {
        console.log('✅ Withdraw successful!');
        setStatus('success');
        fetchContractBalance(); // Refresh balance
      } else {
        console.error('❌ Withdraw failed!');
        setErrorMsg('Withdraw gagal! Cek MetaMask untuk detail.');
        setStatus('error');
      }
    } catch (err) {
      console.error('❌ Withdraw error:', err);
      console.error('❌ Error details:', JSON.stringify(err, null, 2));
      let msg = 'Terjadi kesalahan saat withdraw';
      if (err.code === 4001) msg = 'Anda membatalkan transaksi di MetaMask!';
      else if (err.message) msg = err.message;
      else if (err.data?.message) msg = err.data.message;
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.ethereum) {
      // Get initial accounts
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        })
        .catch(() => {});

      // Get initial chain ID
      window.ethereum.request({ method: 'eth_chainId' })
        .then(id => setChainId(id))
        .catch(() => {});

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (id) => {
        setChainId(id);
      });
    }
  }, []);

  useEffect(() => {
    fetchContractBalance();
    checkOwner();
    fetchAllTransactions();
    fetchAllProfiles();
    
    // Auto refresh data every 10 seconds
    const interval = setInterval(() => {
      fetchContractBalance();
      fetchAllTransactions();
      fetchAllProfiles();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [address, chainId]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic mb-2">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm">Kelola smart contract Zephyr Store</p>
        </div>

        <div className="space-y-6">
          {/* Contract Info */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Informasi Kontrak
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Alamat Kontrak</p>
                <p className="text-sm font-mono text-white break-all">
                  {contractData.address}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Saldo Kontrak</p>
                <p className="text-2xl font-black text-green-400">
                  {formatBalance(contractBalance)} ZPH
                </p>
              </div>
              
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status Owner</p>
                <p className={`text-sm font-bold ${isOwner ? 'text-green-400' : 'text-red-400'}`}>
                  {isOwner ? '✅ Anda adalah Owner' : '❌ Anda bukan Owner'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Jaringan</p>
                <p className={`text-sm font-bold ${isCorrectNetwork ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrectNetwork ? '✅ Hardhat Local' : '❌ Jaringan Salah'}
                </p>
              </div>
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-fuchsia-500 rounded-full"></span>
              Withdraw Saldo
            </h2>
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4">
                <p className="text-xs font-bold text-red-400">❌ Error:</p>
                <p className="text-xs text-red-200 mt-1">{errorMsg}</p>
              </div>
            )}
            
            <p className="text-sm text-zinc-400 mb-4">
              Tarik semua saldo ZPH dari kontrak ke wallet owner Anda.
            </p>
            
            <button
              onClick={handleWithdraw}
              disabled={!address || !isOwner || !isCorrectNetwork || status === 'pending' || status === 'awaiting' || status === 'success'}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                status === 'success'
                  ? 'bg-green-600 text-white'
                  : status === 'error'
                  ? 'bg-red-600 text-white'
                  : !address || !isOwner || !isCorrectNetwork
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 active:scale-95 shadow-lg shadow-fuchsia-500/20'
              }`}
            >
              {status === 'idle' && (address ? (isOwner && isCorrectNetwork ? 'Withdraw All ZPH' : 'Tidak Memiliki Akses') : 'Hubungkan Wallet')}
              {status === 'awaiting' && 'Konfirmasi di MetaMask...'}
              {status === 'pending' && 'Memproses Withdraw...'}
              {status === 'success' && '✅ Withdraw Berhasil!'}
              {status === 'error' && '❌ Withdraw Gagal!'}
            </button>
          </div>

          {/* Transaction History Section */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              History Transaksi Semua User
            </h2>
            
            {fetchError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4">
                <p className="text-xs font-bold text-red-400">❌ Gagal mengambil transaksi:</p>
                <p className="text-xs text-red-200 mt-1">{fetchError}</p>
                <p className="text-[10px] text-zinc-500 mt-2">
                  Pastikan Anda menjalankan file fix-transactions-policy.sql di Supabase SQL Editor!
                </p>
              </div>
            )}
            
            {transactions.length === 0 && !fetchError ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 text-sm">Belum ada transaksi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">No</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">User</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">Game</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">Item</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">Total</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">Status</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">Verifikasi</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-bold uppercase tracking-wider text-xs">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 text-zinc-400">{index + 1}</td>
                        <td className="py-3 px-2 text-white font-bold">{getUserName(tx.user_id)}</td>
                        <td className="py-3 px-2 text-zinc-300">{tx.game || '-'} </td>
                        <td className="py-3 px-2 text-zinc-300">{tx.item || '-'}</td>
                        <td className="py-3 px-2 text-primary font-bold">{formatPrice(tx.amount)}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            tx.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {verificationStatus[tx.id] === true && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                              ✅ Terverifikasi
                            </span>
                          )}
                          {verificationStatus[tx.id] === false && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
                              ❌ Dimanipulasi
                            </span>
                          )}
                          {verificationStatus[tx.id] === null && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400">
                              ⚠️ Tanpa Hash
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-zinc-500 text-xs">{formatDate(tx.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Quick Refresh */}
          <div className="text-center">
            <button
              onClick={() => {
                fetchContractBalance();
                checkOwner();
                fetchAllTransactions();
                fetchAllProfiles();
              }}
              className="text-xs font-bold text-zinc-500 hover:text-white transition-colors"
            >
              🔄 Refresh Semua Data
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
