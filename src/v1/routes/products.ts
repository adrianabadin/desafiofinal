import multer from "multer";
import { Router, Request, Response, NextFunction } from "express";
const Product = require("../../services/dbService.ts").JsonDbManager;
const ItemClass = require("../../services/dbService.ts").ItemClass;
//const express = require("express");
//const validation = require("../../services/validation");
//import bodyParser from "body-parser";
import { dataStream, Item } from "../../types";
const productDbManager = new Product("./src/databases/product");
function midleFunc(req: Request, _res: Response, next: NextFunction) {
  console.log(req.body, "Datos del body");
  next();
}
export const products = Router();
//products.use(express.json());
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/images");
  },
  filename: function (_req, file, cb) {
    cb(null, "" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
products.get(
  "/",

  async (_req, res) => {
    const data: dataStream = await productDbManager.getAll();
    if (data.ok) res.send(data.data);
    else res.send(`Error: ${data.err} Status: ${data.status}`);
  }
);
products.get("/:id", async (req, res) => {
  const data: dataStream = await productDbManager.getById(
    parseInt(req.params.id)
  );
  if (data.ok) res.send(data.data);
  else res.send(`Error: ${data.err} Status: ${data.status}`);
});
//upload.single("image"),
products.post("/", upload.single("image"), midleFunc, async (req, res) => {
  const item: Item = req.body;
  const uploadedImage = `./images/${req.file?.filename}`;
  const data: dataStream = await productDbManager.addItem(
    new ItemClass(
      0,
      item.name,
      item.description,
      item.code,
      uploadedImage,
      item.price,
      item.stock
    )
  );
  if (data.ok) {
    res.status(data.status).send(data.data);
  } else res.status(data.status).send(`${data.err} Status: ${data.status}`);
});
products.put("/:id", upload.single("image"), async (req, res) => {
  const uploadedImage = `./images/${req.file?.filename}`;
  const data: dataStream = await productDbManager.updateById(
    new ItemClass(
      parseInt(req.params.id),
      req.body.name,
      req.body.description,
      req.body.code,
      uploadedImage,
      req.body.price,
      req.body.stock
    )
  );
  if (data.ok) {
    res.status(data.status).send(data.data);
  } else res.status(data.status).send(`${data.err} Status: ${data.status}`);
});
products.delete("/:id", async (req, res) => {
  const data: dataStream = await productDbManager.deleteById(
    parseInt(req.params.id)
  );
  if (data.ok) {
    res.status(data.status).send(data.data);
  } else res.status(data.status).send(`${data.err} Status: ${data.status}`);
});
