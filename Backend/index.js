const express= require('express');
const mongoose= require('mongoose');
const dotenv= require('dotenv');
const app= express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.get('/', (req, res) => {
    res.json('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log(`localhost:${process.env.PORT}`);
});
