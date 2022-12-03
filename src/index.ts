/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import express from 'express'
import { products } from './v1/routes/products'
import { cartRoutes } from './v1/routes/cart'

const PORT = process.env.PORT || 8080
const app = express()
app.use('/api/products', products)
app.use('/api/cart', cartRoutes)

app.use(express.json())
app.use(express.static('./src/public'))
app.get('/', (_req, res) => {
  res.send('Servidor Conectado')
})
app.listen(PORT, () => console.log(`Conectado en el puerto ${PORT}`))
