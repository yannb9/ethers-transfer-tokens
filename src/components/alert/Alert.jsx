import React from 'react'
import { Text, Card, Row } from "@nextui-org/react";
import Success from '../../assets/icons/Success';
import Warning from '../../assets/icons/Warning';
import Error from '../../assets/icons/Error';

export default function Alert({type}) {
  return (
    <Card css={{ $$cardColor: '$colors$success' }}>
        <Card.Body>
        <Row justify="center" align="center">
            <Success />
            <Text h6 size={15} color="white" css={{ m: 0 }}>success!</Text>
        </Row>
        </Card.Body>
  </Card>
  )
}
