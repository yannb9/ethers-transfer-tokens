import React from 'react';
import { useState, useEffect } from 'react'
import { Text, Input, Button, Card } from "@nextui-org/react";
import Content from './components/content/Content';
import Alert from './components/alert/Alert';

import { ethers } from 'ethers';
import ERC20ABI from './ERC20ABI.json';
// import Form from './components/form/Form';
import './App.css'

function App() {
  const [wallet, setWallet] = useState({address:'', ether:'', goerli:'', hord6:'', errors:''})
  const [destination, setDestination] = useState({address:'', ether:'', goerli:'', validated:true, errors:''})
  const [error, setError] = useState('');

  useEffect(() => {
    if(window.ethereum){
      const provider = new ethers.BrowserProvider(window.ethereum);
      const erc20 = new ethers.Contract('0xE72c69b02B4B134fb092d0D083B287cf595ED1E6', ERC20ABI, provider);
      getUserWalletData() //load current account
      erc20.on('Transfer',(from, to, amount, event)=>{
        console.log({from, to, amount, event})
      })
      window.ethereum.on('accountsChanged', getUserWalletData) //load when account is changed
    } else{
      setError('Ethereum not present on page. Install MetaMask')
    }

    return () => {}
  }, [wallet.address])

  const getUserWalletData = async() =>{
    const provider = await new ethers.BrowserProvider(window.ethereum);

    provider.send('eth_requestAccounts',[])
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const erc20 = await new ethers.Contract('0xE72c69b02B4B134fb092d0D083B287cf595ED1E6', ERC20ABI, provider);
    const ether = await erc20.balanceOf(address);
    const goerli = await provider.getBalance(address);
    setWallet(prevState=>{return {...prevState,address: address, ether:ethers.formatEther(ether,18), goerli:ethers.formatEther(goerli,18)}})
  }

  const handleInput = (event) => {
    const input = event.target.value;
    const regex = /^0x[a-fA-F0-9]{40}$/;
    const validInput = regex.test(input);
    setDestination(prevState => {
      return {...prevState, address:input, validated: validInput}
    })
  }

  const handleSubmit = async(event) =>{
    event.preventDefault();
    const data = new FormData(event.target);
    const provider = await new ethers.BrowserProvider(window.ethereum);

    provider.send('eth_requestAccounts',[])
    const signer = await provider.getSigner();
    const erc20 = await new ethers.Contract('0xE72c69b02B4B134fb092d0D083B287cf595ED1E6', ERC20ABI, signer);
    await erc20.transfer(data.get('eth-address'),data.get('eth-amount'));

  }

  return (
    <div className="App">
        <div className='left'>
          <div className='content'>
            <Text h1 className="title">Transfer Ethereum Tokens</Text>
            <Content 
              title="Account Address:"
              content={wallet.address}
            />
            <Content 
              title="Ethers Balance:"
              content={wallet.ether}
            />
            <Content 
              title="Goerli Balance:"
              content={wallet.goerli}
            />
          </div>

          <div className='form-container'>
            <form onSubmit={handleSubmit}>
              <Input 
                type="text" 
                name="eth-address"
                labelPlaceholder="ETH Address" 
                value={destination.address}
                onChange={handleInput}
                helperColor="error"
                helperText={!destination.validated && "Please enter a valid Ethereum address"}
                clearable 
                css={{w:'100%',mb:"7%"}}
              />

              <Input 
                type="number" 
                name="eth-amount"
                labelPlaceholder="Amount in ⧫"
                value={destination.ether}
                onChange={e=>setDestination(prevState=>{return{...prevState, ether:e.target.value}})}
                clearable 
                css={{w:'100%',mb:"7%"}}
              />

              <Button type="submit" css={{w:'100%'}}>TRANSFER</Button>
            </form>
          </div>
          <Alert type="success" />
        </div>
        <div className='right'></div>
    </div>
  )
}

export default App

                  
                  
                  
                  
                  

