'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import contractData from '@/app/contracts/TopUpPayment.json';

const HARDHAT_CHAIN_ID = '0x7a6a'; // 31338 in hex
const HARDHAT_NETWORK_PARAMS = {
  chainId: HARDHAT_CHAIN_ID,
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'Zephyr',
    symbol: 'ZPH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8546'],
};

export default function Web3Payment({ gameSlug, gameName, packageName, priceInIDR, onSuccess }) {
  const [status, setStatus] = useState('idle');
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const ETH_TO_IDR = 5000000;
  const priceInETH = priceInIDR / ETH_TO_IDR;

  const contractDeployed = contractData.address && contractData.address !== '0x0000000000000000000000000000000000000000';
  const isCorrectNetwork = chainId === HARDHAT_CHAIN_ID;

  // Helper function to convert ETH to wei correctly
  const toWei = (eth) => {
    const wei = BigInt(Math.floor(eth * 10**18));
    return '0x' + wei.toString(16);
  };

  // Helper function to switch/add Hardhat network
  const switchToHardhatNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code means that the chain hasn't been added to MetaMask yet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [HARDHAT_NETWORK_PARAMS],
          });
        } catch (addError) {
          console.error('❌ Failed to add network:', addError);
          throw new Error('Gagal menambahkan jaringan Hardhat ke MetaMask!');
        }
      } else {
        console.error('❌ Failed to switch network:', switchError);
        throw new Error('Gagal beralih ke jaringan Hardhat!');
      }
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

  const handlePayment = async () => {
    console.log('🔄 handlePayment called');
    
    if (!address) {
      alert('Silakan hubungkan wallet terlebih dahulu!');
      return;
    }

    if (!contractDeployed) {
      alert('Kontrak belum di-deploy! Jalankan npx hardhat node lalu deploy kontrak!');
      return;
    }

    if (!window.ethereum) {
      alert('MetaMask tidak terinstal!');
      return;
    }

    // Cek jaringan, jika bukan Hardhat, switch dulu
    if (!isCorrectNetwork) {
      console.log('🔄 Switching to Hardhat network...');
      try {
        await switchToHardhatNetwork();
        console.log('✅ Network switched!');
        return; // Jangan lanjut, biar user coba lagi setelah network berubah
      } catch (err) {
        console.error('❌ Network switch error:', err);
        console.dir(err, { depth: null });
        setErrorMsg(err.message || 'Gagal beralih jaringan!');
        setStatus('error');
        return;
      }
    }

    setStatus('awaiting');
    setErrorMsg('');

    try {
      console.log('🔄 Checking Supabase user...');
      // Check if user is logged in to Supabase
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Silakan login terlebih dahulu!');
        return;
      }
      console.log('✅ User found:', user.id);

      // Convert ETH to wei correctly
      const priceInWei = toWei(priceInETH);
      console.log('📤 Sending transaction with params:', {
        to: contractData.address,
        from: address,
        value: priceInWei,
        priceInETH,
        priceInIDR
      });

      // Send simple ETH transfer to contract (let MetaMask handle gas)
      console.log('🔄 Requesting eth_sendTransaction...');
      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            to: contractData.address,
            from: address,
            value: priceInWei,
          },
        ],
      });
      console.log('✅ Transaction sent, tx hash:', tx);
      setStatus('pending');

      // Wait for transaction receipt
      console.log('🔄 Waiting for transaction receipt...');
      let receipt = null;
      let attempts = 0;
      while (!receipt && attempts < 60) {
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [tx],
          });
          if (receipt) {
            console.log('✅ Receipt found on attempt', attempts + 1);
          }
        } catch (e) {
          console.warn('⚠️ Error getting receipt (will retry):', e);
        }
        await new Promise(r => setTimeout(r, 1000));
        attempts++;
      }

      if (receipt) {
        console.log('📄 Transaction receipt:', receipt);
        if (receipt.status === '0x1' || receipt.status === 1) {
          console.log('✅ Transaction successful!');
          try {
            // Step 1: Pastikan profile user ada di database!
            console.log('🔄 Checking profile...');
            let { data: currentProfile, error: profileGetError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            
            if (profileGetError || !currentProfile) {
              console.log('⚠️ Profile not found, creating one...');
              const { error: createProfileError } = await supabase.from('profiles').insert({
                id: user.id,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                email: user.email,
                points: 0,
              });
              
              if (createProfileError) {
                console.error('❌ Error creating profile:', createProfileError);
                console.dir(createProfileError, { depth: null });
                throw createProfileError;
              }
              
              // Dapatkan profile yang baru dibuat
              const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
              currentProfile = newProfile;
              console.log('✅ Profile created!');
            } else {
              console.log('✅ Profile found!');
            }
            
            // Step 2: Insert transaksi ke database
            console.log('🔄 Saving transaction to Supabase...');
            const transactionId = `TRX-${Date.now()}`;
            const { error: txError } = await supabase.from('transactions').insert({
              id: transactionId,
              user_id: user.id,
              game: gameName,
              item: packageName,
              amount: priceInIDR,
              status: 'success',
              payment_method: 'Web3 (MetaMask)',
            });
            
            if (txError) {
              console.error('❌ Error saving transaction to Supabase:');
              console.dir(txError, { depth: null });
              let errorText = 'Gagal menyimpan transaksi';
              if (typeof txError === 'object' && txError !== null) {
                if (txError.message) errorText = txError.message;
                else if (txError.code) errorText = `Error code: ${txError.code}`;
                else if (txError.details) errorText = `Details: ${txError.details}`;
                else if (txError.hint) errorText = `Hint: ${txError.hint}`;
                else errorText = JSON.stringify(txError, null, 2);
              } else if (typeof txError === 'string') {
                errorText = txError;
              }
              setErrorMsg(errorText);
              setStatus('error');
              return;
            }
            console.log('✅ Transaction saved!');
            
            // Step 3: Update points user (optional, no error handling needed)
            try {
              console.log('🔄 Updating points...');
              await supabase.from('profiles').upsert({
                id: user.id,
                points: (currentProfile?.points || 0) + Math.floor(priceInIDR / 1000),
              });
              console.log('✅ Points updated!');
            } catch (e) {
              console.warn('⚠️ Points update failed (ignored):', e);
            }
            
            setStatus('success');
            if (onSuccess) onSuccess();
          } catch (err) {
            console.error('❌ Error in transaction flow:', err);
            console.dir(err, { depth: null });
            let errorText = 'Gagal memproses transaksi';
            if (typeof err === 'object' && err !== null) {
              if (err.message) errorText = err.message;
              else if (err.code) errorText = `Error code: ${err.code}`;
              else errorText = JSON.stringify(err, null, 2);
            } else if (typeof err === 'string') {
              errorText = err;
            }
            setErrorMsg(errorText);
            setStatus('error');
          }
        } else {
          console.error('❌ Transaction failed on chain, receipt status:', receipt.status);
          setErrorMsg('Transaksi gagal di blockchain (reverted). Cek MetaMask untuk detail.');
          setStatus('error');
        }
      } else {
        console.error('❌ No receipt found after 60 attempts');
        setErrorMsg('Transaksi tidak ditemukan setelah 60 detik. Cek tab Activity di MetaMask.');
        setStatus('error');
      }
    } catch (err) {
      console.error('❌ Payment error caught at top level!');
      console.error('❌ Error type:', typeof err);
      console.error('❌ Error:', err);
      console.dir(err, { depth: null });
      
      let msg = 'Terjadi kesalahan yang tidak diketahui';
      
      if (typeof err === 'object' && err !== null) {
        if (err.message) msg = err.message;
        else if (err.data?.message) msg = err.data.message;
        else if (err.code === 4001) msg = 'Kamu membatalkan transaksi di MetaMask!';
        else if (err.code) msg = `Error code: ${err.code}`;
        else msg = JSON.stringify(err, null, 2);
      } else if (typeof err === 'string') {
        msg = err;
      }
      
      console.log('❌ Setting error message:', msg);
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase text-zinc-500">Package</span>
          <span className="text-sm font-bold text-white">{packageName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-zinc-500">Price (ZPH)</span>
          <span className="text-lg font-black text-primary">{priceInETH.toFixed(6)} ZPH</span>
        </div>
      </div>

      {/* Network status warning */}
      {address && !isCorrectNetwork && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-yellow-400">⚠️ Jaringan Salah!</p>
          <p className="text-xs text-zinc-500 mt-1">Klik "Pay with MetaMask" untuk beralih ke jaringan Hardhat Local</p>
        </div>
      )}

      {!contractDeployed && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-yellow-400">⚠️ Kontrak belum di-deploy!</p>
          <p className="text-xs text-zinc-500 mt-1">Jalankan npx hardhat node lalu deploy kontrak!</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <p className="text-xs font-bold text-red-400">❌ Error:</p>
          <p className="text-xs text-red-200 mt-1 font-mono break-all">{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={!address || status === 'pending' || status === 'awaiting' || status === 'success' || !contractDeployed}
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
          status === 'success'
            ? 'bg-green-600 text-white'
            : status === 'error'
            ? 'bg-red-600 text-white'
            : !address || !contractDeployed
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 active:scale-95 shadow-lg shadow-fuchsia-500/20'
        }`}
      >
        {status === 'idle' && (address ? (isCorrectNetwork ? 'Pay with MetaMask' : 'Switch to Hardhat Network') : 'Connect Wallet First')}
        {status === 'awaiting' && (isCorrectNetwork ? 'Confirm in MetaMask...' : 'Switching Network...')}
        {status === 'pending' && 'Processing Transaction...'}
        {status === 'success' && '✅ Payment Successful!'}
        {status === 'error' && '❌ Payment Failed!'}
      </button>

      {status === 'success' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-center">
          <p className="text-sm font-bold text-green-400">Transaction Complete!</p>
          <p className="text-xs text-zinc-500 mt-1">Your game items will be delivered shortly.</p>
        </div>
      )}
    </div>
  );
}
