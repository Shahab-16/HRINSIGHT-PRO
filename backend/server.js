const express=require('express');
const dotenv=require('dotenv');
const app=express();

const PORT=process.env.PORT || 3000;
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(PORT,(req,res)=>{
    console.log(`Server running on port ${PORT}`);
})