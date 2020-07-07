import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Like from './common/like';
import Table from './common/table';

class MoviesTable extends Component {
  column = [
    {
      path: 'title',
      label: 'Title',
      content: (movie) => <Link to={`movies/${movie._id}`}>{movie.title}</Link>,
    },
    { path: 'genre.name', label: 'Genre' },
    { path: 'numberInStock', label: 'Stock' },
    { path: 'dailyRentalRate', label: 'Rate' },
    {
      content: (movie) => (
        <Like liked={movie.liked} item={movie} onLike={this.props.onLike} />
      ),
      key: 'like',
    },
    {
      content: (movie) => (
        <button
          className="btn btn-danger btn-sm m-2"
          onClick={() => this.props.onDelete(movie)}
        >
          Delete
        </button>
      ),
      key: 'delete',
    },
  ];

  render() {
    const { movies, sortColumn, onSort } = this.props;

    return (
      <Table
        column={this.column}
        data={movies}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default MoviesTable;
