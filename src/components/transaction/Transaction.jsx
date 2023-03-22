import React from 'react'
import { Collapse, Text, Link, Grid, Badge } from "@nextui-org/react";
import './Transaction.css'

export default function Transaction({txdata}) {
  return (

    <Grid.Container gap={0}>
      <Grid>
        <Collapse.Group splitted className='transactions'>
          <Collapse title="Transfer Executed" subtitle={txdata.date} >
            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>From:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>{txdata.from}</Text>
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>To:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>{txdata.to}</Text>
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>Amount:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>{txdata.amount}</Text>
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>Status:
              <Badge color="success" variant="flat">Success</Badge>
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>Transaction Link:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}></Text>
              <Link target="_blank" href={`https://goerli.etherscan.io/tx/${txdata.hash}`}>
              {`https://goerli.etherscan.io/tx/${txdata.hash}`}
                </Link>
            </Text>
            
          </Collapse>
        </Collapse.Group>
      </Grid>
    </Grid.Container>
  )
}
