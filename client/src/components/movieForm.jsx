import React, { Component } from 'react';
import Joi from '@hapi/joi';
import Form from './common/form';
import { getGenres } from '../services/fakeGenreService';
import { getMovie, saveMovie } from '../services/fakeMovieService';

class MovieForm extends Form {
  state = {
    data: {
      title: '',
      genreId: '',
      numberInStock: '',
      dailyRentalRate: '',
    },
    errors: {},
    genres: [],
    movies: [],
  };

  componentDidMount = () => {
    this.setState({ genres: getGenres() });

    const movieId = this.props.match.params.id;
    if (movieId === 'new') return;

    const movie = getMovie(movieId);
    if (!movie) return this.props.history.replace('/not-found');

    this.setState({ data: this.mapToViewModel(movie) });
    console.log(this.state.data);
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).max(50),
    dailyRentalRate: Joi.number().min(0).max(10),
  };

  mapToViewModel = (movie) => {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  };

  doSubmit = () => {
    saveMovie(this.state.data);

    this.props.history.push('/movies');
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Movie form</h1>
        {this.renderInput('title', 'Title')}
        {this.renderSelect('genreId', 'Genre', this.state.genres)}
        {this.renderInput('numberInStock', 'Stock')}
        {this.renderInput('dailyRentalRate', 'Rate')}
        {this.renderButton('Save')}
      </form>
    );
  }
}

export default MovieForm;
