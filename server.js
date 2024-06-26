import express from'express';
import path from 'path';
import { fileURLToPath } from 'url';
import notes from './routes/notes.js';
import logger from './middleware/loggerMiddleware.js';
import errorHandler from './middleware/errorMiddleware.js';
import notFound from './middleware/notFound.js';
import cors from 'cors';
const port = process.env.PORT || 8000;

//Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use(cors());

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger middleware
app.use(logger);

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/notes', notes);

//Error handler
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server is running on port ${port}`));