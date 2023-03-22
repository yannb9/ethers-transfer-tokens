import React, { useState, useEffect } from 'react';
import { Text, Button, Loading } from "@nextui-org/react";
import { v4 } from 'uuid'

import { useHandleGetAccount } from './hooks/useHandleGetAccount';
import { useHandleSubmitTransfer } from './hooks/useHandleSubmitTransfer';

import Header from './components/header/Header';
import Alert from './components/alert/Alert';
import InputField from './components/inputField/InputField';
import Transaction from './components/transaction/Transaction';
import './App.css'

function App() {
  const { wallet } = useHandleGetAccount();
  const [formData, transactions, handleSubmit] = useHandleSubmitTransfer();
  const [alert, setAlert] = useState('')


  useEffect(()=>{
    let alertSettings = {};
    if(wallet.status === 'error'){
      alertSettings = {status: wallet.status, message: wallet.message};
    }
    alertSettings = {status: formData.status, message: formData.message};
    setAlert(alertSettings);
    let resetAlert = setTimeout(() => {
      setAlert({});
    }, 15000);

    return () =>{
      clearTimeout(resetAlert)
    }

  },[wallet, formData])

  const userWalletData = [
    {
      title:'Acc Address:',
      subtitle: wallet?.address
    },
    {
      title:'HORD6 Balance:',
      subtitle: Number(wallet?.hord6).toLocaleString()
    },
    {
      title:'Goerli Balance:',
      subtitle: Number(wallet?.goerli).toFixed(5)
    }
  ]

  return (
    <div className="App">
        <div className='left'>
          <div className='content'>
            <Text h1 className="title">Transfer Ethereum Tokens</Text>
            0xca7243f6B7D56790adE5a6f1f2121e7d7b8B7f26
            {wallet.isLoading ? <Loading /> 
            : 
            userWalletData.map(data=>
              <Header
              key={v4()}
              title={data.title}
              subtitle={data.subtitle}
              />)
            }

              <div className='form-container'>
                  <form onSubmit={handleSubmit}>
                      <InputField 
                          type="text" 
                          name="eth-address"
                          labelPlaceholder="ETH Address" 
                          disabled={formData.isLoading}
                          clearable 
                      />

                      <InputField
                          type="number" 
                          name="eth-amount"
                          labelPlaceholder="HORD6 Transfer Amount"
                          disabled={formData.isLoading}
                          clearable 
                      />

                      { formData.isLoading ? <Loading /> :
                          <Button type="submit" css={{w:'100%'}}>SEND TOKENS</Button>
                      }
                    </form>
                </div>
                {
                  alert.status &&
                  <Alert 
                    type={alert.status}
                    text={alert.message}
                  /> 
                }
            </div>
        </div>

        <div className='right'>
        {transactions.length &&
          transactions.map((transaction) =>
            <Transaction key={v4()} txdata={transaction}/>
          )
        }
        </div>
    </div>
  )}

export default App