let notes = [
    { id: 1, title: 'Note One', content: 'Note 1 Content goes here', starred: true},
    { id: 2, title: 'Note Two', content: 'Note 2 Content goes here', starred: true},
    { id: 3, title: 'Note Three', content: 'Note 3 Content goes here', starred: true},
    { id: 4, title: 'Note Four', content: 'Note 4 Content goes here', starred: true},
    { id: 5, title: 'Note Five', content: 'Note 5 Content goes here', starred: true},
];

//Get all Notes | GET /api/notes
export const getNotes = (req, res, next) => {
    res.status(200).json(notes);
}

//Get a single Note | GET /api/notes/:id
export const getNote = (req, res, next) => {
    const id = parseInt(req.params.id);
    const note = notes.find((note) => note.id === id);

    if (!note) {
        const error = new Error(`A note with the id of ${id} was not found`);
        error.status = 404;
        return next(error);
    }
    res.status(200).json(note);
}


//Create a Note | POST /api/notes
export const createNote = (req, res, next) => {
    const newNote = {
        id: notes.length + 1,
        title: req.body.title
    };

    if (!newNote.title) {
        const error = new Error('Please include a title');
        error.status = 400;
        return next(error);
    }

    notes.push(newNote);
    res.status(201).json(notes);
}

//Update a Note | PUT /api/notes/:id
export const updateNote = (req, res, next) => {
    const id = parseInt(req.params.id);
    const note = notes.find((note) => note.id == id);

    if (!note) {
        const error = new Error(`A note with the id of ${id} was not found`);
        error.status = 404;
        return next(error);
    }

    note.title = req.body.title;
    res.status(200).json(notes);
}


//Delete a Note | DELETE /api/notes/:id
export const deleteNote = (req, res, next) => {
    const id = parseInt(req.params.id);
    const note = notes.find((note) => note.id == id);

    if (!note) {
        const error = new Error(`A note with the id of ${id} was not found`);
        error.status = 404;
        return next(error);
    }

    notes = notes.filter((note) => note.id != id);
    res.status(200).json(notes);
}



//Get Starred Notes | GET /api/notes/starred
//router.get('/starred', (req, res) => {
//    const limit = parseInt(req.query.limit);

//    if (!isNaN(limit) && limit > 0) {
//        return res.status(200).json(notes.slice(0, limit));
//    }

//    res.status(200).json(notes);
//});

//
