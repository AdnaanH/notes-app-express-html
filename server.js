const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000;

const app = express();

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')));

let notes = [
    { id: 1, title: 'Note One', content: 'Note 1 Content goes here'},
    { id: 2, title: 'Note Two', content: 'Note 2 Content goes here'},
    { id: 3, title: 'Note Three', content: 'Note 3 Content goes here'},
    { id: 4, title: 'Note Four', content: 'Note 4 Content goes here'},
    { id: 5, title: 'Note Five', content: 'Note 5 Content goes here'},
];

//Get Starred Notes
//app.get('/api/starred-notes/', (req, res) => {
//    const limit = parseInt(req.query.limit);

//    if (!isNaN(limit) && limit > 0) {
//        res.json(notes.slice(0, limit));
//    } else {
//        res.json(notes);
//    }
//});

//Get all notes
app.get('/api/notes', (req, res) => {
    res.status(200).json(notes);
});

//Get a single note
app.get('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.status(200).json(notes.filter((note) => note.id === id));
});

app.listen(port, () => console.log(`Server is running on port ${port}`));