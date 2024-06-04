const express = require('express');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = 80;

app.use(cors())
app.use(express.static('public'));
app.use(express.json());

var test = ["hei", "hallo", "lol"]

app.get('/test', async function (req, res) {
    res.json(test)
    
})

app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
    console.log(test)
})