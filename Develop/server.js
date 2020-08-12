const express = require("express");
const notes = require("../Develop/db/db.json");//../db/db.json
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");

// const notes = require("../Develop/");

const port = 3000; 
const app = express();

app.use(bodyParser.json())
app.use(express.static('public'))

// viewed at http://localhost:8080 use to connect frontend
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '../public/index.html'));// '/../public/index.html'
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname + '../public/notes.html'));// '/../public/notes.html'
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.post('/api/notes', (req, res) => {
    const newNote = req.body
    newNote.id = Date.now().toString();//unique id
    notes.push(newNote);
    writeFile(JSON.stringify(notes));//update after +1
    res.json({
        success: true
    })
    console.log(newNote);
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const deleteIndex = notes.findIndex(item => {
        return item.id === id
    });
    if (deleteIndex === -1) {
        res.json({
            success: false,
            message: "ID doesn't exist"
        })
    }
    else {
        notes.splice(deleteIndex, 1);
        writeFile(JSON.stringify(notes));//update after delete
        res.json({
            success: true
        })
    }
})

//starting server: last
app.listen(port, () => {
    console.log(`Note Taker app listening at http://localhost:${port}`)
})

//saving to file
const writeFile = fileContent => {
    return new Promise((resolve, reject) => {
        fs.writeFile('../Develop/db/db.json',fileContent, err => {
            if (err){
                reject(err);
            }
            resolve({
                ok: true,
                message: 'File created!'
            });
        });
    });
};
