import React from 'react'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'
import Button from '@material-ui/core/Button'

import { useEagerConnect, useInactiveListener } from '../hooks'
import {
  injected,
} from '../connectors'
import { Spinner } from '../components/Spinner'
import { Balance } from '../components/Balance'
// import logo from '../assets/3fold_logo.png'

enum ConnectorNames {
  Injected = 'Injected',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export default function() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  )
}

function App() {
  const context = useWeb3React<Web3Provider>()
  const { connector, account, activate, error, active } = context

  const currentConnector = connectorsByName['Injected']

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  const color = active ? 'secondary' : 'primary'
  const connected = currentConnector === connector
  const disabled = !triedEager || !!activatingConnector || connected || !!error
  const activating = currentConnector === activatingConnector

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', height: 100, padding: 10 }}>
        {!connected && (<Button
          style={{ height: 50 }}
          variant="contained" 
          color={color} 
          onClick={() => {
            setActivatingConnector(injected)
            activate(injected)
          }}
          disabled={disabled}
        >
          Connect wallet
        </Button>)}
        {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}

        {connected && !error && account && (
          <span>{`🟢 ${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span>
        )}
        {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
      </div>
      
      <div style={{ width: '50%', margin: 'auto', textAlign: 'center' }}>
        <img style={{ width: '30%', height: '30%' }} src={'/3fold_logo.png'} />
        <h2>TFT Binance Chain bridge</h2>
        <Balance />
      </div>

    </div>
  )
}