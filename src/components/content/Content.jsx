import React from 'react'
import { Text } from "@nextui-org/react";

export default function Content({title, content}) {
  return (
    <Text className="headers" weight="bold">{title}
        <Text span className="values" weight="normal" css={{d:'block', fontSize:'14px'}}>{content}</Text>
    </Text>
  )
}
