import React from 'react'
import {Input, Button } from "@nextui-org/react";

export default function Form() {
  return (
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
  )
}
