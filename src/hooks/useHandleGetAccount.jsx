import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import ERC20ABI from '../ERC20ABI.json';
const ERC20ABI_ADDRESS = '0xE72c69b02B4B134fb092d0D083B287cf595ED1E6';

export const useHandleGetAccount = () => {
  const [wallet, setWallet] = useState({
    address: '',
    ether: '',
    goerli: '',
    hord6: '',
    erc20: '',
    isLoading:true,
    error: ''
  });

  const setUserETHAccount = useCallback(async () => { 
  // wrap the function with useCallback to memoize it
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(ERC20ABI_ADDRESS, ERC20ABI, provider);

        const accountAddress = await signer.getAddress();
        const accountBalance = await erc20.balanceOf(accountAddress);
        const goerliBalance = await provider.getBalance(accountAddress);
        const decimals = await erc20.decimals()
  
        setWallet((prevState) => ({
          ...prevState,
          address: accountAddress,
          ether: ethers.formatEther(accountBalance),
          hord6: ethers.formatUnits(accountBalance, decimals),
          goerli: ethers.formatEther(goerliBalance, 18),
          erc20,
          status:'success',
          message:'Wallet loaded Successfully',
          isLoading:false
        }));

      } catch (error) {
        setWallet((prevState)=>({
          ...prevState,
          status: 'error',
          message: error.message
        }));
      }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = () => setUserETHAccount(); // extract setUserETHAccount function into a variable to avoid creating a new reference on each render
    if (!window.ethereum) {
      setWallet(prevState => ({
        ...prevState,
        status:'error',
        message: 'Ethereum not present on the page. Please install MetaMask.'
      }));
    } else {
      setUserETHAccount();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('error', (error)=>console.log(error));
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [setUserETHAccount]);

  return { wallet };
};
