const fs = require("fs");
class JsonStorage {
  constructor(file:string) {
    this.chat = [];
    file;
  }
  async readData() {
    if (fs.existsSync(this.file)) {
      this.chat = await JSON.parse(
        await fs.promises.readFile(this.file, "utf-8")
      );
      return this.chat;
    } else fs.promises.writeFile(this.file, "[]", "utf-8");
  }
  lastId() {
    if (this.chat.length > 0) {
      const resultado =
        Math.max(...this.chat.map((chatItem) => parseInt(chatItem.id))) || 0;
      return resultado;
    } else return -1;
  }
  saveFile() {
    return fs.promises.writeFile(this.file, JSON.stringify(this.chat), "utf-8");
  }
  async addItem(item) {
    const datos = await this.readData();
    let objeto;
    console.log(datos, "datos");
    if (datos.length > 0) {
      const id = parseInt(this.lastId()) + 1;
      objeto = { ...item, id: id };
    } else {
      objeto = { ...item, id: 0 };
    }
    this.chat.push(objeto);
    this.saveFile();
  }
}

module.exports = ChatHistory;
