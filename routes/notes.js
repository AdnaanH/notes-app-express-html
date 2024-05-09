import express from 'express';
import { createNote, deleteNote, getNote, getNotes, updateNote, } from '../controllers/noteController.js';

const router = express.Router();

//Get all notes
router.get('/', getNotes);

//Get a single note
router.get('/:id', getNote);

//Create new note
router.post('/', createNote);

//Update a note
router.put('/:id', updateNote);

//Delete a note
router.delete('/:id', deleteNote);

export default router