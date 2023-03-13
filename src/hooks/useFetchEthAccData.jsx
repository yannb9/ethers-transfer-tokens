import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import ERC20ABI from '../ERC20ABI.json';
const ERC20ABI_ADDRESS = '0xE72c69b02B4B134fb092d0D083B287cf595ED1E6';

export const useFetchEthAccData = () => {
  const [wallet, setWallet] = useState({
    address: '',
    ether: '',
    goerli: '',
    hord6: '',
    erc20_p: '',
    erc20_s: '',
    isLoading:true,
    error: ''
  });

  const setUserETHAccount = useCallback(async () => { // wrap the function with useCallback to memoize it
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const erc20_p = new ethers.Contract(ERC20ABI_ADDRESS, ERC20ABI, provider);
        const erc20_s = new ethers.Contract(ERC20ABI_ADDRESS, ERC20ABI, signer);

        const accountAddress = await signer.getAddress();
        const accountBalance = await erc20_p.balanceOf(accountAddress);
        const goerliBalance = await provider.getBalance(accountAddress);
  
        setWallet((prevState) => ({
          ...prevState,
          address: accountAddress,
          ether: ethers.formatEther(accountBalance),
          hord6: ethers.formatUnits(accountBalance, 6),
          goerli: ethers.formatEther(goerliBalance, 18),
          erc20_p,
          erc20_s,
          isLoading:false
        }));

      } catch (error) {
        setWallet((prevState)=>({
          ...prevState,
          error: error.message
        }));
      }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = () => setUserETHAccount(); // extract setUserETHAccount function into a variable to avoid creating a new reference on each render
    if (!window.ethereum) {
      setWallet(prevState => ({
        ...prevState,
        error: 'Ethereum not present on the page. Please install MetaMask.'
      }));
    } else {
      setUserETHAccount();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [setUserETHAccount]);

  return { wallet };
};
