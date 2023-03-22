import React, { useState } from 'react';
import { ethers } from 'ethers';
import ERC20ABI from '../ERC20ABI.json';
const ERC20ABI_ADDRESS = '0xE72c69b02B4B134fb092d0D083B287cf595ED1E6';

export const useHandleSubmitTransfer = () => {
  const [formData, setFormData] = useState({});
  const [transactions, setTransactions] = useState([])

  const getDateFormat = () =>{
    return new Intl.DateTimeFormat('en-us', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(new Date())
}

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormData(prevState => {
      return { ...prevState, isLoading: true }
    })
    const data = new FormData(event.target);
    const recipientAddress = data.get('eth-address');
    const recipientAmount = data.get('eth-amount');

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(ERC20ABI_ADDRESS, ERC20ABI, signer);
    const decimals = await erc20.decimals();
    const amount = ethers.parseUnits(recipientAmount, decimals)
    const gasPrice = await provider.send('eth_gasPrice', [])

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      setFormData(prevState => {
        return {
          ...prevState,
          status:'error',
          message: 'Transaction Failed: Please enter a valid Ethereum address',
          isLoading: false
        }
      })
      return;
    }
    try {
      await erc20.transfer(recipientAddress, amount)
        .then(transaction => {
          transaction.wait().then(receipt => {
            
            setFormData(prevState => {
              return {
                ...prevState,
                from: receipt.from,
                to: receipt.to,
                status: 'success',
                message:'Transfer Sent Successfully',
                hash: receipt.hash,
                isLoading: false
              }
            })
            setTransactions([...transactions,{
              from: receipt.from,
              to: receipt.to,
              amount: receipt.amount,
              status: 'success',
              hash: receipt.hash,
              link:`https://goerli.etherscan.io/tx/${receipt.hash}`,
              date: getDateFormat()
            }])
          }).catch(error => {
            setFormData(prevState => {
              return {
                ...prevState,
                status: 'error',
                message: 'Transaction Failed: ' + error,
                isLoading: false
              }
            })
          })
        })

    } catch (error) {
      let errorMsg = '';
      if (error.code === -32603) {
        // specific error from blockchain if it exists
        // may not work with providers different from Metamask
        errorMsg = error.data.message
      }
      const errorString = JSON.stringify(error)
      const errorObj = JSON.parse(errorString)
      errorMsg = errorObj.info.error.message;

      setFormData(prevState => {
        return {
          ...prevState,
          status: 'error',
          message: 'Transaction Failed: ' + errorMsg,
          isLoading: false
        }
      })
    }
  };
  // returning the following possible fields: 
  // status:
  // hash:receipt
  // isLoading
  // error
  return [formData, transactions, handleSubmit];
}