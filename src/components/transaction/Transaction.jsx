import React from 'react'
import { Collapse, Text, Link, Grid, Badge } from "@nextui-org/react";
import './Transaction.css'

export default function Transaction({from, to, amount, status, hash, date}) {
  return (

    <Grid.Container gap={0}>
      <Grid>
        <Collapse.Group splitted className='transactions'>
          <Collapse title="Transfer Executed" subtitle={date} >
            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>From:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>{from}</Text>
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>To:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>{to}</Text>
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>Amount:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>{amount}</Text>
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>Status:
              <Badge color="success" variant="flat">Success</Badge>
              {/* <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>{status}</Text> */}
            </Text>

            <Text weight="bold" css={{fs:'14px', color:'#252525'}}>Transaction Link:
              <Text span weight="normal" css={{ml:'10px', color: '#7e868c', fs:'14px'}}>Link</Text>
            </Text>
            
          </Collapse>
        </Collapse.Group>
      </Grid>
    </Grid.Container>
  )
}
