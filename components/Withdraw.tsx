import { Form, Button } from 'react-bootstrap'
import { useFormik } from 'formik'

import styles from './Withdraw.module.scss'

const validate = values => {
  const errors = {
    stellarAddress: '',
    amount: ''
  }

  if (!values.stellarAddress) {
    errors.stellarAddress = 'Required'
  } else if (values.stellarAddress.length > 15) {
    errors.stellarAddress = 'Must be 15 characters or less'
  }

  if (!values.amount) {
    errors.amount = 'Required'
  }

  return errors
}


export function Withdraw ({ balance, submitWithdraw }) {
  const formik = useFormik({
    initialValues: {
      stellarAddress: '',
      amount: 0,
    },
    validate,
    onSubmit: values => {
      const { stellarAddress, amount } = values
      submitWithdraw(stellarAddress, amount)
    },
  })

  return (
    <div className={styles.container}>
      <span>Fill in this form to withdraw tokens back to Stellar</span>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Form.Group controlId="formStellarAddress">
          <Form.Label className={styles.formLabel}>Stellar address</Form.Label>
          <Form.Control
            className={styles.formText}
            placeholder="Enter Stellar Address"
            required
            name="stellarAddress"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.stellarAddress}
          />

          {formik.touched.stellarAddress && formik.errors.stellarAddress ? (
            <div className={styles.errorField}>{formik.errors.stellarAddress}</div>
          ) : null}
        </Form.Group>

        <Form.Group controlId="formStellarAddress">
          <Form.Label className={styles.formLabel}>Amount</Form.Label>
          <Form.Control
            className={styles.formText}
            placeholder="Enter Amount"
            required
            name="amount"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.amount}
            type='number'
          />

          {formik.touched.amount && formik.errors.amount ? (
            <div className={styles.errorField}>{formik.errors.amount}</div>
          ) : null}
        </Form.Group>

        <Button color='primary' variant="primary" style={{ marginTop: 25 }} type='submit'>
          Withdraw
        </Button>
      </Form>
    </div>
  )
}