import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import QrCode from 'qrcode.react'
import WarningIcon from '@material-ui/icons/Warning'
import { Checkbox, FormControlLabel } from '@material-ui/core'

const BRIDGE_TFT_ADDRESS = process.env.BRIDGE_TFT_ADDRESS || 'GCV3MIR5VFTDPD6CDCKTP65KPV7BOXOPSSHSFUO3QDREGEQR46HI7UCG'

export default function DepositDialog({ open, handleClose, address }) {
  if (!address) return null

  const parsedAddress = Buffer.from(address.replace('0x', ''), 'hex').toString('base64')

  const [checked, setChecked] = useState(false)

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'lg'}
        fullScreen={true}
      >
        <DialogTitle id="alert-dialog-title">{"Swap Stellar TFT for BSC TFT"}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ margin: 'auto', textAlign: 'center',  width: '50%', display: 'flex', flexDirection: 'column' }}>
            <WarningIcon style={{ alignSelf: 'center', fontSize: 40, color : 'orange' }}/>
            If you want to swap your Stellar TFT to Binance Chain TFT you can transfer any amount to the destination address. 
            Note that you have to explicity send the generated memo text! <b style={{ color: 'red', marginTop: 5 }}>Sending funds to any other address or without memo text will result in loss of funds!</b>
          </DialogContentText>

          <FormControlLabel
            style={{ margin: 'auto', marginTop: 20, width: '60%', display: 'flex', justifyContent: 'center' }}
            control={
              <Checkbox value={checked} onChange={(e) => setChecked(e.target.checked)} />
            }
            label="I aggree that I can send any amount to the specified address with specified memo text, other information will result in loss of funds."
          />

          {checked && (
            <>
              <DialogContentText style={{ margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', marginTop: 40 }}>
                <span><b>Enter the following information manually:</b></span>
                <span style={{ marginTop: 20 }}>Destination: <b>{BRIDGE_TFT_ADDRESS}</b></span>
                <span>Memo: <b>{parsedAddress}</b></span>
              </DialogContentText>
              <DialogContentText style={{ margin: 'auto', textAlign: 'center', width: '50%', display: 'flex', flexDirection: 'column' }}>
                <h4>
                    Or scan the QR code with Threefold Connect
                </h4>
                <span></span>
                <QrCode style={{ alignSelf: 'center' }} value={`TFT:${BRIDGE_TFT_ADDRESS}?message=${parsedAddress}&sender=me`} />
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button style={{ width: 200, height: 50 }} variant='contained' onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}