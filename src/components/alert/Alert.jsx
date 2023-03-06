import React from 'react'
import './Alert.css'
import { Text, Card, Row } from "@nextui-org/react";
import Success from '../../assets/icons/Success';
import Warning from '../../assets/icons/Warning';
import Error from '../../assets/icons/Error';

export default function Alert({type, text}) {
  let color,icon,bg;
  switch (type) {
    case 'success':
      icon= <Success />
      color = '#13a452'
      bg = '#dafbe8';
      break;
    case 'warning':
      icon= <Warning />
      bg = '#3a2503'
      color = '#f6ad37';
      break;
    case 'error':
      icon= <Error />
      bg = '#300313'
      color = '#f4256d';
      break;
    default:
      color = 'gray';
  }

  return (
    <div className="alert" style={{backgroundColor: bg, color: color}}>
      hello there askdlfjhalskdjfhlasjdhflaksdjfhalskdjfh
  </div>
  )
}
