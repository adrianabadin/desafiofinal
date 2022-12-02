const fs = require("fs");

// import { Color } from "colors";
import { Version, Item, dataStream } from "../types";
const TIMEOUT = 3000;
class ItemClass {
  public id: number;
  public timeStamp: number;
  public name: string;
  public description: string;
  public code: string;
  public image: string;
  public price: number;
  public stock: number;
  constructor(
    id: number,
    name: string,
    description: string,
    code: string,
    image: string,
    price: number,
    stock: number
  ) {
    this.id = id;
    this.timeStamp = Date.now();
    this.name = name;
    this.description = description;
    this.code = code;
    this.image = image;
    this.price = price;
    this.stock = stock;
  }
}
class VersionClass {
  public timeStamp: number;
  public blocked: boolean;
  public blockStart: number;
  constructor(timeStamp: number, blocked: boolean, blockStart: number) {
    this.timeStamp = timeStamp;
    this.blocked = blocked;
    this.blockStart = blockStart;
  }
}
class JsonDbManager {
  public file: string;
  public data: Array<Item>;
  public version: Version;
  constructor(file: string) {
    this.file = file;
    this.data = [];
    this.version = new VersionClass(0, false, 0);
  }
  async loadVersion() {
    let version: Version;
    if (fs.existsSync(`${this.file}.version`)) {
      console.log("Existe");
      version = await JSON.parse(
        await fs.promises.readFile(`${this.file}.version`, "utf-8")
      );
      console.log(version);
    } else {
      console.log("No existe");
      version = new VersionClass(Date.now(), false, 0);
      await fs.promises.writeFile(
        `${this.file}.version`,
        JSON.stringify(version),
        "utf-8"
      );
    }
    return version;
  }
  async versionCompare() {
    const objectVersion: Version = this.version;
    const dbVersion: Version = await this.loadVersion();
    if (dbVersion.timeStamp !== objectVersion.timeStamp) {
      return false;
    } else return true;
  }

  async updateVersion(block: boolean) {
    if (block) this.version = new VersionClass(Date.now(), true, Date.now());
    else this.version = new VersionClass(Date.now(), false, 0);
    fs.promises.writeFile(
      `${this.file}.version`,
      JSON.stringify(this.version),
      "utf-8"
    );
  }
  async readData() {
    if (!(await this.versionCompare())) {
      console.log("verison compare false");
      if (fs.existsSync(`${this.file}.JSONE`)) {
        this.data = await JSON.parse(
          `[${await fs.promises.readFile(`${this.file}.JSONE`, "utf-8")}]`
        );
      } else {
        const jsonMod = JSON.stringify(this.data).slice(
          1,
          this.data.length - 1
        );
        fs.promises.writeFile(`${this.file}.JSONE`, jsonMod, "utf-8");
        this.updateVersion(false);
      }
    }
    return this.data;
  }
  async saveFile() {
    while ((await this.loadVersion()).blocked === true) {
      console.log("DataStorage blocked");
      setTimeout(() => this.updateVersion(false), TIMEOUT);
    }
    await this.updateVersion(true);
    const jsonEdited = JSON.stringify(this.data).slice(1, -1);
    await fs.promises.writeFile(`${this.file}.JSONE`, jsonEdited, "utf-8");
    await this.updateVersion(false);
  }
  largestId(): number {
    let id;
    if (fs.existsSync(`${this.file}.JSONE`) && this.data.length > 0) {
      id = Math.max(...this.data.map((item) => item.id)) + 1;
    } else id = 0;
    return id;
  }
  async appendItem(item: string) {
    setTimeout(() => this.updateVersion(false), TIMEOUT);
    while ((await this.loadVersion()).blocked === true) {
      console.log("DataStorage blocked");
    }
    await this.updateVersion(true);
    try {
      fs.promises.appendFile(`${this.file}.JSONE`, item);
    } catch (err) {
      console.log(err);
    }
    await this.updateVersion(false);
  }
  async addItem(item: Item): Promise<dataStream> {
    await this.readData();
    let response: dataStream;
    const itemUpdated: Item = { ...item, id: this.largestId() };
    this.data.push(itemUpdated);
    try {
      if (this.data.length > 1) {
        this.appendItem("," + JSON.stringify(itemUpdated));
      } else this.appendItem(JSON.stringify(itemUpdated));
      response = {
        data: [itemUpdated],
        ok: true,
        err: "",
        status: 200,
        textStatus: "Element updated",
      };
    } catch (e) {
      response = {
        data: [],
        ok: false,
        err: "Unable to write in the DB",
        status: 400,
        textStatus: "",
      };
    }
    return response;
  }
  async getById(id: number) {
    await this.readData();
    const response = await this.data.filter((item) => item.id === id);
    return response.length === 0
      ? {
          data: [],
          textStatus: "",
          err: "The id does not exist",
          status: 403,
          ok: false,
        }
      : {
          data: response,
          textStatus: "Element found",
          err: " ",
          status: 200,
          ok: true,
        };
  }
  async getAll(): Promise<dataStream> {
    await this.readData();
    return this.data.length > 0
      ? {
          data: this.data,
          ok: true,
          err: "",
          status: 200,
          textStatus: "Get All elements Fullfiled",
        }
      : {
          data: [],
          ok: true,
          textStatus: "No data contained",
          status: 403,
          err: "",
        };
  }
  async deleteById(id: number) {
    await this.readData();
    const item = this.data.find((dataItem) => dataItem.id === id);
    console.log("id: ", id, "Item: ", item);
    if (item) {
      this.data = this.data.filter((item) => item.id !== id);
      this.saveFile();
      return {
        data: [item],
        ok: true,
        err: "",
        status: 200,
        textStatus: "Element Deleted",
      };
    } else
      return {
        data: [],
        ok: false,
        err: "The id does not exist",
        status: 400,
        textStatus: "The id does not exist",
      };
  }
  async updateById(item: Item) {
    await this.readData();
    const dataIndex = this.data.findIndex(
      (dataItem) => dataItem.id === item.id
    );
    console.log(dataIndex, "resultado");
    if (dataIndex !== -1) {
      this.data[dataIndex] = item;
      this.saveFile();
      return {
        data: [item],
        ok: true,
        err: "",
        status: 200,
        textStatus: "Successyfull update",
      };
    } else
      return {
        data: [],
        ok: false,
        err: "The Id doesnt exist",
        status: 400,
        textStatus: "The Id doesnt exist",
      };
  }
}

module.exports = { JsonDbManager, ItemClass };
