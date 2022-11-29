import express from "express"
export const products=express.Router()
products.get("/",(_req,res)=>{
res.send("Holas desde api")
})

