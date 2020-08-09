const express = require("express");
const notes = require("../db/db.json");
const port = 3000;
var app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json()
)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.post('/api/notes', (req, res) => {
    const newNote = req.body
    notes.push(newNote);
    res.json({
        success: true
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const deleteIndex = notes.findIndex(item => {
        return item.id === id
    });
    if(deleteIndex === -1) {
        res.json({
            success: false,
            message: "ID doesn't exist"
        })
    }
    else {
        notes.splice(deleteIndex, 1);
        res.json({
            success: true
        })
    }
    res.send('delete notes' + id)
})



//starting server: last
app.listen(port, () => {
    console.log(`example app listening at http://localhost:${port}`)
})



//saving notes
