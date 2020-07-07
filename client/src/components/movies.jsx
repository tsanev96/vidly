import React, { Component } from 'react';
import MoviesTable from './moviesTable';
import Pagination from './common/pagination';
import ListGroup from './common/listGroup';
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import { paginate } from './utils/paginate';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import SearchBox from './common/searchBox';

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    sortColumn: { order: 'asc', path: 'title' },
    selectedGenre: null,
    searchQuery: '',
    currentPage: 1,
    pageSize: 4,
  };

  componentDidMount() {
    const genres = [{ name: 'All Genres', key: 'all' }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  getPageData = () => {
    const {
      movies: allMovies,
      selectedGenre,
      searchQuery,
      sortColumn,
      pageSize,
      currentPage,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery) {
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedGenre && selectedGenre._id)
      allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sorted, pageSize, currentPage);

    return { totalCount: filtered.length, movies };
  };

  handleLike = (movie) => {
    const { movies } = this.state;
    const index = movies.indexOf(movie);

    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handleDelete = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: '', currentPage: 1 });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = ({ currentTarget: input }) => {
    this.setState({
      searchQuery: input.value,
      selectedGenre: null,
      currentPage: 1,
    });
  };

  render() {
    if (this.state.movies.length === 0) return <p>No movies in the database</p>;

    const {
      genres,
      selectedGenre,
      searchQuery,
      sortColumn,
      pageSize,
      currentPage,
    } = this.state;

    const { totalCount, movies } = this.getPageData();

    return (
      <div className="container">
        <div className="row">
          <div className="col-2">
            <ListGroup
              data={genres}
              selectedItem={selectedGenre}
              onItemSelect={this.handleGenreSelect}
            />
          </div>
          <div className="col">
            <Link to="/movies/new" className="btn btn-small btn-primary m-2">
              New Movie
            </Link>
            <p>There are {this.state.movies.length} movies in the database</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <MoviesTable
              movies={movies}
              sortColumn={sortColumn}
              onSort={this.handleSort}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
