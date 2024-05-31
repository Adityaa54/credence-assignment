const express = require('express');
const router = express.Router();
const Movie = require('./models/Movie');

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one movie
router.get('/:id', getMovie, (req, res) => {
  res.json(res.movie);
});

// Create a movie
router.post('/', async (req, res) => {
  const movie = new Movie({
    name: req.body.name,
    img: req.body.img,
    summary: req.body.summary
  });
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a movie
router.patch('/:id', getMovie, async (req, res) => {
  if (req.body.name != null) {
    res.movie.name = req.body.name;
  }
  if (req.body.img != null) {
    res.movie.img = req.body.img;
  }
  if (req.body.summary != null) {
    res.movie.summary = req.body.summary;
  }
  try {
    const updatedMovie = await res.movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a movie
router.delete('/:id', getMovie, async (req, res) => {
  try {
    await res.movie.remove();
    res.json({ message: 'Deleted Movie' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getMovie(req, res, next) {
  let movie;
  try {
    movie = await Movie.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: 'Cannot find movie' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.movie = movie;
  next();
}

module.exports = router;
