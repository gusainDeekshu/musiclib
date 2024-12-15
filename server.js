
const express=require('express');
const cors=require('cors');
const newLocal = `./db`;
const { connectMongodb } = require(newLocal);
const newLocal_1 = './routes/userroute';
const userrouter=require(newLocal_1)
const path = require("path");
const { getdata } = require('./controllers/usercontroller');

// app config
const app=express();
const port=process.env.PORT||3002;

// middleware
app.use(express.json());
app.use(cors());
 
app.get('/',(req,res)=>{res.send("api is working")});

//establishin db conex=ctions
connectMongodb(process.env.MongoUrl)

//api endpoint for user
app.use("/api/v1",userrouter);
app.use(express.static("uploads"))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.listen(port,()=>{
  console.log(new Date().toISOString()+`:server started on http://localhost:${port}`)
   
})