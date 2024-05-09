const express = require('express');
const notes = require('./routes/notes')
const path = require('path');
const port = process.env.PORT || 8000;

const app = express();

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/notes', notes);

app.listen(port, () => console.log(`Server is running on port ${port}`));