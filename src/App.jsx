import React, { useState, useEffect, useMemo } from 'react';
import { Text, Button, Loading } from "@nextui-org/react";
import { v4 } from 'uuid'
import { ethers } from 'ethers';

import { useFetchEthAccData } from './hooks/useFetchEthAccData';
import ERC20ABI from './ERC20ABI.json';
import Header from './components/header/Header';
import Alert from './components/alert/Alert';
import InputField from './components/inputField/InputField';
import Transaction from './components/transaction/Transaction';

const ERC20ABI_ADDRESS = '0xE72c69b02B4B134fb092d0D083B287cf595ED1E6';
import './App.css'

function App() {
  const {wallet} = useFetchEthAccData();
  const [transactions, setTransactions] = useState([])
  const [txStatus, setTxStatus] = useState();

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.send('eth_requestAccounts',[]);
    const erc20 = new ethers.Contract(ERC20ABI_ADDRESS, ERC20ABI, provider);
  
    const listener = (from, to, amount, event) => {
      const txArray = [...transactions, {
        from,
        to,
        amount: String(amount),
        hash: event.log.transactionHash,
        date:new Intl.DateTimeFormat('en-us', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }).format(new Date())
      }]
      setTransactions(txArray)
      setIsLoading(false)
      erc20.removeListener('Transfer', listener)
    };
  
    erc20.on('Transfer', listener);
  
    return () => {
      erc20.removeListener('Transfer', listener)
    };
  }, [transactions]);


  const handleSubmitTransfer = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    const data = new FormData(event.target);
    const recipientAddress = data.get('eth-address');
    const recipientAmount = data.get('eth-amount');
    const regex = /^0x[a-fA-F0-9]{40}$/;
    const ethReq = wallet.erc20_s;
    // const gasPrice = getGasPrices();
    // console.log(gasPrice)

    if(!regex.test(recipientAddress)){
      setError('Please enter a valid Ethereum address')
      return;
    }
    try {
      await ethReq.transfer(recipientAddress, recipientAmount)
    } catch (err) {
      const errMsg = err.message.match(/(^.*?(?=\())/g)      // extracting the main message from the log
      setError(`${errMsg}. Please try again`)
      setIsLoading(false)
    }
  };

  const userWalletData = [
    {
      title:'Acc Address:',
      subtitle: wallet.address
    },
    {
      title:'Ethers Balance:',
      subtitle: wallet.ether
    },
    {
      title:'HORD6 Balance:',
      subtitle: wallet.hord6
    },
    {
      title:'Goerli Balance:',
      subtitle: wallet.goerli
    }
  ]

  return (
    <div className="App">
        <div className='left'>
          <div className='content'>
            <Text h1 className="title">Transfer Ethereum Tokens</Text>

            {!wallet.isLoading ? userWalletData.map(data=>
              <Header
                key={v4()}
                title={data.title}
                subtitle={data.subtitle}
              />
            ) : <Loading />
          }
          </div>

          <div className='form-container'>
            <form onSubmit={handleSubmitTransfer}>
              <InputField 
                type="text" 
                name="eth-address"
                labelPlaceholder="ETH Address" 
                disabled={isLoading}
                // value={e.target.value}
                // value='0xca7243f6B7D56790adE5a6f1f2121e7d7b8B7f26'
                clearable 
              />

              <InputField
                type="number" 
                name="eth-amount"
                labelPlaceholder="Token Amount in ⧫ERC (1 = 1000 so put 1000)"
                disabled={isLoading}
                // value={destination.ether}
                // value={1000}
                clearable 
              />
              {
                isLoading ? <Loading /> :
                <Button type="submit" css={{w:'100%'}}>SEND TOKENS</Button>
              }
            </form>
          </div>
          {
            wallet.error ? 
            <Alert type='error' text={wallet.error}/> 
            :
            error ?
            <Alert type='error' text={error}/>
            : transactions[transactions.length -1]?.date  === new Intl.DateTimeFormat('en-us', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }).format(new Date()) && <Alert type='success' text='Transfer successfully made!'/>
          }
        </div>
        <div className='right'>
          {transactions.map((tx)=>
          // from, to, amount, status, hash, date
          <Transaction
            key={v4()}
            from={tx.from}
            to={tx.to}
            amount={tx.amount}
            hash={tx.hash}
            status=''
            date={tx.date}
          />)}
        </div>
    </div>
  )}

export default App

                  
                  
                  
                  
                  

