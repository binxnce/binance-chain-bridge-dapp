import { FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core'
import { useEffect, useState } from 'react'

import styles from './Withdraw.module.scss'

export function Withdraw ({ balance, submitWithdraw }) {
  const [stellarAddress, setStellarAddress] = useState('')
  const [stellarAddressError, setStellarAddressError] = useState('')

  const [amount, setAmount] = useState(0)
  const [amountError, setAmountError] = useState('')

  // Initialize balance
  useEffect(() => {
    if (balance) {
      setAmount(parseInt(balance) / 1e7)
    }
  }, [balance])

  const submit = () => {
    if (stellarAddress === '') {
      setStellarAddressError('Address not valid')
      return
    }

    if (amount <= 0 || amount > balance / 1e7) {
      setAmountError('Amount not valid')
      return
    }

    submitWithdraw(stellarAddress, amount)
  }

  const handleStellarAddressChange = (e) => {
    setStellarAddressError('')
    setStellarAddress(e.target.value)
  }

  const handleAmountChange = (e) => {
    setAmountError('')
    try {
      const a = parseInt(e.target.value)
      if (isNaN(a)) {
        setAmount(0)
      } else {
        setAmount(a)
      }
    } catch (err) {
      setAmountError(err)
    }
  }

  return (
    <div className={styles.container}>
      <span>Fill in this form to withdraw tokens back to Stellar</span>
        <FormControl>
          <InputLabel htmlFor="StellarAddress">Stellar Address</InputLabel>
          <Input 
            value={stellarAddress}
            onChange={handleStellarAddressChange}
            id="StellarAddress"
            aria-describedby="my-helper-text"
          />
          <FormHelperText id="my-helper-text">Enter a valid Stellar Address</FormHelperText>
          {stellarAddressError && (
            <div className={styles.errorField}>{stellarAddressError}</div>
          )}
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="StellarAddress">Amount</InputLabel>
          <Input 
            value={amount}
            onChange={handleAmountChange}
            id="amount"
            aria-describedby="my-helper-text"
            type='float'
          />
          <FormHelperText id="my-helper-text">Enter an amount</FormHelperText>
          {amountError && (
            <div className={styles.errorField}>{amountError}</div>
          )}
        </FormControl>

        <Button 
          color='primary'
          variant="contained"
          style={{ marginTop: 25 }}
          type='submit'
          onClick={() => submit()}
        >
          Withdraw
        </Button>
    </div>
  )
}