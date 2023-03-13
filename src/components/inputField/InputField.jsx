import React from 'react'
import { Input } from '@nextui-org/react'

export default function InputField ({
  name,
  labelPlaceholder,
  disabled,
  value,
  onChange,
  helperText,
  clearable
}) {
  return (
    <Input
      type='text'
      name={name}
      labelPlaceholder={labelPlaceholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      helperColor='error'
      helperText={helperText}
      clearable={clearable}
      css={{ w: '100%', mb: '7%' }}
    />
  )
}
