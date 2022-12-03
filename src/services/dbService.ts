// import { Color } from "colors";
import { Version, Item, dataStream } from '../types'

import fs from 'fs'
const TIMEOUT = 3000
export class ItemClass {
  public id: number
  public timeStamp: number
  public name: string
  public description: string
  public code: string
  public image: string
  public price: number
  public stock: number
  constructor (
    id: number,
    name: string,
    description: string,
    code: string,
    image: string,
    price: number,
    stock: number
  ) {
    this.id = id
    this.timeStamp = Date.now()
    this.name = name
    this.description = description
    this.code = code
    this.image = image
    this.price = price
    this.stock = stock
  }
}
class VersionClass {
  public timeStamp: number
  public blocked: boolean
  public blockStart: number
  constructor (timeStamp: number, blocked: boolean, blockStart: number) {
    this.timeStamp = timeStamp
    this.blocked = blocked
    this.blockStart = blockStart
  }
}
export class JsonDbManager {
  public file: string
  public data: Item[]
  public version: Version
  constructor (file: string) {
    this.file = file
    this.data = []
    this.version = new VersionClass(0, false, 0)
  }

  async loadVersion (): Promise<Version> {
    let version: Version
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (fs.existsSync(`${this.file}.version`)) {
      console.log('Existe')
      version = await JSON.parse(
        await fs.promises.readFile(`${this.file}.version`, 'utf-8')
      )
      console.log(version)
    } else {
      console.log('No existe')
      version = new VersionClass(Date.now(), false, 0)
      await fs.promises.writeFile(
        `${this.file}.version`,
        JSON.stringify(version),
        'utf-8'
      )
    }
    return version
  }

  async versionCompare (): Promise<boolean> {
    const objectVersion: Version = this.version
    const dbVersion: Version = await this.loadVersion()
    if (dbVersion.timeStamp !== objectVersion.timeStamp) {
      return false
    } else return true
  }

  async updateVersion (block: boolean): Promise<void> {
    if (block) this.version = new VersionClass(Date.now(), true, Date.now())
    else this.version = new VersionClass(Date.now(), false, 0)
    void fs.promises.writeFile(
      `${this.file}.version`,
      JSON.stringify(this.version),
      'utf-8'
    )
  }

  async readData (): Promise<Item[]> {
    if (!(await this.versionCompare())) {
      console.log('verison compare false')
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(fs.existsSync(`${this.file}.JSONE`))) {
        this.data = await JSON.parse(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `[${await fs.promises.readFile(`${this.file}.JSONE`, 'utf-8')}]`
        )
      } else {
        const jsonMod = JSON.stringify(this.data).slice(
          1,
          this.data.length - 1
        )
        void fs.promises.writeFile(`${this.file}.JSONE`, jsonMod, 'utf-8')
        void this.updateVersion(false)
      }
    }
    return this.data
  }

  async saveFile (): Promise<void> {
    while ((await this.loadVersion()).blocked) {
      console.log('DataStorage blocked')
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => await this.updateVersion(false), TIMEOUT)
    }
    await this.updateVersion(true)
    const jsonEdited = JSON.stringify(this.data).slice(1, -1)
    await fs.promises.writeFile(`${this.file}.JSONE`, jsonEdited, 'utf-8')
    await this.updateVersion(false)
  }

  largestId (): number {
    let id
    if ((Boolean(fs.existsSync(`${this.file}.JSONE`))) && this.data.length > 0) {
      id = Math.max(...this.data.map((item) => item.id)) + 1
    } else id = 0
    return id
  }

  async appendItem (item: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => await this.updateVersion(false), TIMEOUT)
    while ((await this.loadVersion()).blocked) {
      console.log('DataStorage blocked')
    }
    await this.updateVersion(true)
    try {
      void fs.promises.appendFile(`${this.file}.JSONE`, item)
    } catch (err) {
      console.log(err)
    }
    await this.updateVersion(false)
  }

  async addItem (item: Item): Promise<dataStream> {
    await this.readData()
    let response: dataStream
    const itemUpdated: Item = { ...item, id: this.largestId() }
    this.data.push(itemUpdated)
    try {
      if (this.data.length > 1) {
        await this.appendItem(',' + JSON.stringify(itemUpdated))
      } else await this.appendItem(JSON.stringify(itemUpdated))
      response = {
        data: [itemUpdated],
        ok: true,
        err: '',
        status: 200,
        textStatus: 'Element updated'
      }
    } catch (e) {
      response = {
        data: [],
        ok: false,
        err: 'Unable to write in the DB',
        status: 400,
        textStatus: ''
      }
    }
    return response
  }

  async getById (id: number): Promise<dataStream> {
    await this.readData()
    const response = await this.data.filter((item) => item.id === id)
    return response.length === 0
      ? {
          data: [],
          textStatus: '',
          err: 'The id does not exist',
          status: 403,
          ok: false
        }
      : {
          data: response,
          textStatus: 'Element found',
          err: ' ',
          status: 200,
          ok: true
        }
  }

  async getAll (): Promise<dataStream> {
    await this.readData()
    return this.data.length > 0
      ? {
          data: this.data,
          ok: true,
          err: '',
          status: 200,
          textStatus: 'Get All elements Fullfiled'
        }
      : {
          data: [],
          ok: true,
          textStatus: 'No data contained',
          status: 403,
          err: ''
        }
  }

  async deleteById (id: number): Promise<dataStream> {
    await this.readData()
    const item = this.data.find((dataItem) => dataItem.id === id)
    console.log('id: ', id, 'Item: ', item)
    if (item != null) {
      this.data = this.data.filter((item) => item.id !== id)
      await this.saveFile()
      return {
        data: [item],
        ok: true,
        err: '',
        status: 200,
        textStatus: 'Element Deleted'
      }
    } else {
      return {
        data: [],
        ok: false,
        err: 'The id does not exist',
        status: 400,
        textStatus: 'The id does not exist'
      }
    }
  }

  async updateById (item: Item): Promise<dataStream> {
    await this.readData()
    const dataIndex = this.data.findIndex(
      (dataItem) => dataItem.id === item.id
    )
    console.log(dataIndex, 'resultado')
    if (dataIndex !== -1) {
      this.data[dataIndex] = item
      await this.saveFile()
      return {
        data: [item],
        ok: true,
        err: '',
        status: 200,
        textStatus: 'Successyfull update'
      }
    } else {
      return {
        data: [],
        ok: false,
        err: 'The Id doesnt exist',
        status: 400,
        textStatus: 'The Id doesnt exist'
      }
    }
  }
}

module.exports = { JsonDbManager, ItemClass }
