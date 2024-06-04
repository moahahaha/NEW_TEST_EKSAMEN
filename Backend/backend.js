const express = require('express');
const path = require('path');
const cors = require('cors')
var mysql = require('mysql');
const app = express();
const PORT = 80;

const fs = require('fs');

app.use(cors())
app.use(express.static('public'));
app.use(express.json());


var con = mysql.createConnection({
    host: "10.0.0.156",
    user: "ida_backend",
    password: "Passord1",
    database: "bibliotek_db"
});


function saveTestData(data) {
    fs.writeFileSync('testData.json', JSON.stringify(data, null, 2), 'utf8');
}

function loadTestData() {
    try {
        const data = fs.readFileSync('testData.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading test data file:', error);
        return [];
    }
}

app.get('/books', function (req, res) {

    con.query("SELECT * FROM boker"
    , function (err, result, fields) {
      if (err) throw err;
        console.log(result);
        console.log('Sendt books')
        res.json({
         books: result
        })
     
      });
  });

  app.post('/books', function (req, res) {
    const { ISBN, Tittel, Publiseringsar, AvdelingID } = req.body;
    const sql = "INSERT INTO boker (ISBN, Tittel, Publiseringsar, AvdelingID) VALUES (?, ?, ?, ?)";
    con.query(sql, [ISBN, Tittel, Publiseringsar, AvdelingID], function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding book');
      } else {
        console.log('Book added', result);
        res.status(201).send('Book added');
      }
    });
  });

  app.delete('/books/:ISBN', function (req, res) {
    const ISBN = req.params.ISBN;
    const sql = "DELETE FROM boker WHERE ISBN = ?";
    con.query(sql, [ISBN], function (err, result) {
        if (err) {
            console.error(err);
        res.status(500).send('Error deleting book')
    }else {
        console.log('Book deleted', result)
        res.status(200).send('book deleted')
    }
    })
  })



var test = loadTestData();

app.get('/test', async function (req, res) {
    res.json(test)
    
})

app.post('/test', function (req, res) {
    const { testItem } = req.body; 
    saveTestData(test);
    test.push(testItem);
    res.status(201).send('Test added');
  });

app.delete('/test/:test', function (req, res) {
    const RemoveTest = req.params.test;
    const index = test.indexOf(RemoveTest)
    saveTestData(test);
    if (index > -1) {
        test.splice(index, 1);
        res.status(200).send('Test deleted');
      } else {
        res.status(404).send('Test not found');
      }
})

app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
    console.log(test)
})