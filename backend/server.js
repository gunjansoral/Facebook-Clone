const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { readdirSync } = require('fs')
const fileUpload = require("express-fileupload")
require('dotenv').config()

const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true
}))

//routes
readdirSync('./routes').map(r => app.use('/', require('./routes/' + r)))

//database
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
    })
    .then(() => console.log('database connected successfully'))
    .catch((e) => console.log('database connecion error', e))
app.listen(process.env.PORT, () => console.log(`listening from port ${process.env.PORT}`))