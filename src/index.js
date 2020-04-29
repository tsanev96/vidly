const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB..'))
    .catch(err => console.log(err.message));

app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port 3000..'))

