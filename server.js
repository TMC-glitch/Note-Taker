const express = require("express");
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const app = express();


var PORT = process.env.PORT || 4023;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));



app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
app.get('/api/notes', (req, res) => {
    fs.readFile("db/db.json", (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.send(data)
        }
    })
})
app.post('/api/notes', (req, res) => {
    fs.readFile("db/db.json", (err, data) => {
        if (err) {
            console.log(err)
        } else {
            let notes = JSON.parse(data)
            let newNote = req.body
            newNote["id"] = uuidv4()
            console.log(newNote.id, newNote)
            notes.push(newNote)
            fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
                if (err) {
                    console.log(err)
                } else console.log("new note has been stored.")
            })
            res.json(newNote)
        }
    })
})
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("db/db.json", (err, data) => {
        if (err) {
            console.log(err)
        } else {
            let notes = JSON.parse(data)
            notes = notes.filter(note => {
                note.id != req.params.id

            })
            fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
                if (err) {
                    console.log(err)
                } else console.log("note has been deleted.")
            })
        }
        res.json({})
    })
})

//Start listen
app.listen(PORT, function () {
    console.log("App on PORT: " + PORT);
});