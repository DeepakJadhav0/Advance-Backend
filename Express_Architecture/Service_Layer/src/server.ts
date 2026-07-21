import express from "express";
import { route } from "./router/route.js";

const app = express()

app.use(express.json())

app.use("/api/v1",route)

app.listen(3000 , ()=>{
    console.log('Server has started on 3000')
})