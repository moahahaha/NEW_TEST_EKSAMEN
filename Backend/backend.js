//import needed modules
const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();
const PORT = 80;

var mysql = require('mysql');

const fs = require('fs'); //import FIle system module

app.use(cors())
app.use(express.static('public')); //.....?
app.use(express.json()); //.....?

//mySQL connection
var con = mysql.createConnection({
    host: "10.0.0.156",
    user: "ida_backend",
    password: "Passord1",
    database: "bibliotek_db"
});


//funksjon lagre data til JSON file 
function saveTestData(data) {
    fs.writeFileSync('testData.json', JSON.stringify(data, null, 2), 'utf8'); //write data to testData.json
}

//funksjon load data fra JSON filen testData.json
function loadTestData() {
    try {
        const data = fs.readFileSync('testData.json', 'utf8'); //les data fra testData.json filen
        return JSON.parse(data); //parse or return data som JSON
    } catch (error) {
        console.error('Error reading test data file:', error);
        return []; //return et tomt array hvis error oppstår 
    }
}


//Endpoint for å hente bøker fra databasen
app.get('/books', function (req, res) {

    con.query("SELECT * FROM boker" // SQL query for å Hente ut alt fra boker tabellen
    , function (err, result, fields) {
      if (err) throw err;
        console.log(result);
        console.log('Sendt books')
        res.json({
         books: result // Send resultat som en JSON response
        })
     
      });
  });

//Endpoint for å legge til ny bok i databasen
  app.post('/books', function (req, res) {
    const { ISBN, Tittel, Publiseringsar, AvdelingID } = req.body; //extract book dataen fra request body
    const sql = "INSERT INTO boker (ISBN, Tittel, Publiseringsar, AvdelingID) VALUES (?, ?, ?, ?)"; 
    con.query(sql, [ISBN, Tittel, Publiseringsar, AvdelingID], function (err, result) { //SQL query insert ny bok
      if (err) { //hvis error 
        console.error(err);
        res.status(500).send('Error adding book'); //sed 500 status code og error message
      } else {

        console.log('Book added', result); //resultat til console
        res.status(201).send('Book added'); // 201 status code og success message
      }
    });
  });

  //Endpoint for å slette en bok fra databasen
  app.delete('/books/:ISBN', function (req, res) {
    const ISBN = req.params.ISBN; //extract ISBN fra URL parameter
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



var test = loadTestData(); //var test = data fra load test data funksjon

//Endpoint for å hente test items 
app.get('/test', async function (req, res) {
    res.json(test)
    
})

//Endpoint for å legge til et nytt test item
app.post('/test', function (req, res) {
    const { testItem } = req.body; 
    saveTestData(test);
    test.push(testItem);
    res.status(201).send('Test added');
  });

  //Endpoint for å slette et test item
app.delete('/test/:test', function (req, res) {
    const RemoveTest = req.params.test; // Extract test item fra URL parameter
    const index = test.indexOf(RemoveTest) // finn index til test item i test arrayet
    saveTestData(test);
    if (index > -1) { //hvis det ble en mindre index - den ble fjernet
        test.splice(index, 1);
        res.status(200).send('Test deleted');
      } else {
        res.status(404).send('Test not found');
      }
})

//Start server
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
    console.log(test)
})