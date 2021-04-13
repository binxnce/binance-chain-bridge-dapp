import React from 'react'
import { useWeb3React } from '@web3-react/core'

const CONTRACT_ADDRESS_TESTNET = "0x770b0AA8b5B4f140cdA2F4d77205ceBe5f3D3C7e"
import abi from '../tokenabi.json'
var Contract = require('web3-eth-contract')

export function Balance () {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = React.useState()
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false

      Contract.setProvider(library.provider)
      const contract = new Contract(abi, CONTRACT_ADDRESS_TESTNET)
      
      contract.methods.balanceOf(account).call({ from: account })
        .then(balance => {
          if (!stale) {
            setBalance(balance)
          }
        })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  if (!balance) return (
    <span>Connect your wallet to continue</span>
  )

  return (
    <>
      <span>Your TFT Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>{balance === null ? 'Error' : balance ? `TFT: ${formatBalance(balance)}` : ''}</span>
    </>
  )
}

const formatBalance = (balance) => {
  return parseInt(balance) / 1e7
}