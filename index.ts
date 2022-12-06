require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const bodyParser=require('body-parser');

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(()=>{
   app.listen(process.env.PORT || 5000)}
   ).catch((err:string)=>console.log(err))
 
