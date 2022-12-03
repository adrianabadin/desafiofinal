export interface Version {
  timeStamp: number
  blocked: boolean
  blockStart: number
}

export interface Item {
  id: number
  timeStamp: number
  name: string
  description: string
  code: string
  image: string
  price: number
  stock: number
}
export interface dataStream {
  data: Item[]
  ok: boolean
  err: string
  status: number
  textStatus: string
}

export interface ValidationObject {
  name: RegExp
  description: RegExp
  price: RegExp
  stock: RegExp
  code: RegExp
}

export interface Cart {
  id: number
  timestamp: number
  products: Item[]
}
export type SelectionObject = 'PRODUCTS' | 'CART'
