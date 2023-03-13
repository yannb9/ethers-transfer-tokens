import React from 'react'
import { Text } from '@nextui-org/react'

export default function Header ({ title, subtitle }) {
  return (
    <Text className='headers' weight='bold'>
      {title}
      <Text
        span
        className='values'
        weight='normal'
        css={{ fontSize: '14px', color: '#7e868c', ml: '10px' }}
      >
        {subtitle}
      </Text>
    </Text>
  )
}
