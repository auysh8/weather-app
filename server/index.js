const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { url } = require('node:inspector');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


app.get('/forecast' , async (req , res)=> {
    const city = req.query.city;
    console.log(city);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    try{
        const response = await axios.get(url);
        res.json(response.data);
    }
    catch(error){
        console.error(error);
    }
})

app.get('/weather' , async (req , res)=> {
    const city = req.query.city;
    console.log(city);
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try{
        const response = await axios.get(url);
        
        res.json(response.data);
    }
    catch(error){
        console.log(error);
    }
});

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})