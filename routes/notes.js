const express = require('express');
const router = express.Router();

let notes = [
    { id: 1, title: 'Note One', content: 'Note 1 Content goes here'},
    { id: 2, title: 'Note Two', content: 'Note 2 Content goes here'},
    { id: 3, title: 'Note Three', content: 'Note 3 Content goes here'},
    { id: 4, title: 'Note Four', content: 'Note 4 Content goes here'},
    { id: 5, title: 'Note Five', content: 'Note 5 Content goes here'},
];

//Get Starred Notes
//router.get('/starred-notes', (req, res) => {
//    const limit = parseInt(req.query.limit);

//    if (!isNaN(limit) && limit > 0) {
//        return res.status(200).json(notes.slice(0, limit));
//    }

//    res.status(200).json(notes);
//});

//Get all notes
router.get('/', (req, res) => {
    res.status(200).json(notes);
});

//Get a single note
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find((note) => note.id === id);

    if (!note) {
        return res
        .status(404)
        .json({msg: `A note with the id of ${id} was not found`})
    }
    res.status(200).json(note);
});

module.exports = router