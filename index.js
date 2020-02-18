const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');


//Navázání připojení s databází
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
})

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

const app = express();

//Uživatel a server komunikují s json em, tak je tu body Parser
app.use(bodyParser.json());

//K uživateli se dostane celá složka public
app.use(express.static('public'));


//Zprácování POST requestu, který přidá nového kosmonauta do databáze
app.post('/addpost', (req, res) => {
    console.log(req.body);
    let post = {
        firstname: req.body.firstname,
        surname: req.body.surname,
        birth: req.body.birth,
        power: req.body.power
    };
    let sql = 'INSERT INTO cosmonauts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post added...');
    })
});


//Zpracování odstranení kosmonauta z databáze (pomocí jejich id); také POST request
app.post('/rempost', (req, res) => {
    console.log(req.body);
    let sql = 'DELETE FROM `cosmonauts` WHERE `cosmonauts`.`id` = ' + req.body.id;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post removed...');
    })
});


//Zprácování GET requestu, který pošle uživateli všechny kosmonauty
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM cosmonauts';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify(result));
    })
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});