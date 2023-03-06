import { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import contractABI from './contractABI.json';
import { Text, Input, Spacer, Button } from "@nextui-org/react";
// import Form from './components/form/Form';

import './App.css'

function Test() {
  const [wallet, setWallet] = useState(null);;
  const [walletBalance, setWalletBalance] = useState(null);
  const [error, setError] = useState('')

  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [isValid, setIsValid] = useState(true);

  const [txHash, setTxHash] = useState('')

  //need to refactor this
  useEffect(() => {
    if(window.ethereum){
      getAccountAddress() //load current account
      window.ethereum.on('accountsChanged', getAccountAddress) //load when account is changed
    } else{
      setError('Ethereum not present on page. Install MetaMask')
    }
    return;
  }, [])


  const getAccountAddress = () =>{
    window.ethereum.request({method:'eth_requestAccounts'})
    .then(res=>{
      setWallet(res[0])
      getAccountBalance(res[0])
    })
  }

  const getAccountBalance = (address) =>{
    window.ethereum.request({method:'eth_getBalance', params:[address, 'latest']})
    .then(balance=>setWalletBalance(ethers.formatEther(balance)))
  }
  
  const handleInput = (event) => {
    const input = event.target.value;
    const regex = /^0x[a-fA-F0-9]{40}$/;
    const isValidInput = regex.test(input);
    setDestination(input);
    setIsValid(isValidInput);
  }

  const handleSubmit = (event) =>{
    event.preventDefault();
    // ethers.getAddress()
    const data = new FormData(event.target);
    const ethAddress = data.get('eth-address');
    const ethAmount = data.get('eth-amount');

    // console.log(data.get('address'))
    sendEthPayement(ethAddress, ethAmount)
  }

  const sendEthPayement = async(address, ether) =>{
    try {
      window.ethereum.request({method:'eth_requestAccounts'})
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const transaction = await signer.sendTransaction({
        to: address,
        value: ethers.parseEther(ether)
      })
      console.log(transaction)
    } catch (error) {
      setError(error)
    }
  }


  // const getUserData = async() =>{
  //   window.ethereum.request({method:'eth_requestAccounts'})
  //   .then((res)=>{
  //     setWallet(res[0]);
  //     setObjWallet(prevState => {return {...prevState, address:res[0]}})
  //     return res[0]
  //   })
  //   .then((res)=>window.ethereum.request({method:'eth_getBalance', params:[res, 'latest']}))
  //   .then(balance=>{
  //     setWalletBalance(ethers.formatEther(balance))
  //     setObjWallet(prevState=>{return {...prevState, balance:ethers.formatEther(balance)}})
  //   })
  // }


  return (
    <div className="App">
        <div className='left'>
          <div className='title'>
            <Text h1 size={32} css={{textGradient: "45deg, #012a4a -20%, #468faf 50%",marginBottom:'5%', textAlign:'left'}} weight="bold">Transfer Tokens</Text>
            <Text size={18} css={{textAlign:'left'}} weight="bold">Account Address:</Text>
            <Text size={16} css={{color:"#5c677d", textAlign:'left'}} weight="normal">{wallet}</Text>
            <Text size={18} css={{textAlign:'left'}} weight="bold">Account Balance:</Text>
            <Text size={16} css={{color:"#5c677d", marginBottom:'20%', textAlign:'left'}} weight="normal">{walletBalance}</Text>
          </div>
          {/* <Form 
          /> */}
          <div className='form-container'>

            <form onSubmit={handleSubmit}>
              <Input 
                type="text" 
                name="eth-address"
                labelPlaceholder="ETH Address" 
                value={destination}
                onChange={handleInput}
                helperColor="error"
                helperText={!isValid && "Please enter a valid Ethereum address"}
                clearable 
                css={{w:'400px',mb:"7%"}}
              />

              <Input 
                type="number" 
                name="eth-amount"
                labelPlaceholder="Amount in ⧫"
                value={amount}
                onChange={e=>setAmount(e.target.value)}
                clearable 
                css={{w:'400px',mb:"7%"}}
              />

              <Button type="submit" css={{w:'100%'}}>Default</Button>
            </form>
          </div>
        </div>
        <div className='right'></div>
    </div>
  )
}

export default App
