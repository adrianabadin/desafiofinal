/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

// import express = require('express')
import express from 'express'
// const express = require('express')
import products from './v1/routes/products'
import carts from './v1/routes/cart'
const ex = require('express')

const PORT = process.env.PORT || 8080
const app = express()
app.use(ex.json())
app.use(ex.urlencoded({ extended: true }))
app.use('/api/products', products)
app.use('/api/cart', carts)
app.use((req, res) => {
  res.status(404).send(`The route ${req.path} in the method ${req.method} is not yet implemented`)
})

app.use(express.static('./src/public'))
app.get('/', (_req, res) => {
  res.redirect('/api/products')
})
app.listen(PORT, () => console.log(`Conectado en el puerto ${PORT}`))
