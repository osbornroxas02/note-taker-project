const express = require("express");
const notes = require("./db/db.json");
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");

// const port = 3001;
const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json())
app.use(express.static('./public'))

// viewed at http://localhost:8080 use to connect frontend
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/notes.html'));
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
app.listen(PORT, () => {
    console.log(`example app listening at http://localhost:${PORT}`)
})


//saving to file
const writeFile = fileContent => {
    return new Promise((resolve, reject) => {
        fs.writeFile('./db/db.json',fileContent, err => {
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
