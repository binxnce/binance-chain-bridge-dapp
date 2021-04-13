import App from 'next/app'
import Head from 'next/head'

import '../styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default class Root extends App {
  render() {
    const { Component } = this.props

    return (
      <>
        <Head>
          <title>Threefold BSC Bridge</title>
        </Head>

        <Component />
      </>
    )
  }
}
