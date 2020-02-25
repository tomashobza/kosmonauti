const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
})

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

const app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/addpost', (req, res) => {
    let query = db.query('INSERT INTO cosmonauts SET ?', {
        firstname: req.body.firstname,
        surname: req.body.surname,
        birth: req.body.birth,
        power: req.body.power
    }, err => {
        if (err) throw err;
        res.send({ msg:'Post added...' });
    })
});

app.post('/rempost', (req, res) => {
    let query = db.query(`DELETE FROM cosmonauts WHERE cosmonauts.id = ${req.body.id}`, err => {
        if (err) throw err;
        res.send({ msg:'Post removed...' });
    })
});

app.get('/getposts', (req, res) => {
    let query = db.query('SELECT * FROM cosmonauts', (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify(result));
    })
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});