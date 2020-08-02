import React, { Component } from 'react';

class TableHeader extends Component {
  raiseSort = (columnPath) => {
    const { sortColumn, onSort } = this.props;

    if (sortColumn.path === columnPath)
      sortColumn.order = sortColumn.order === 'asc' ? 'desc' : 'asc';
    else {
      sortColumn.path = columnPath;
      sortColumn.order = 'asc';
    }

    onSort(sortColumn);
  };

  renderSortIcon = (columnPath) => {
    const { sortColumn } = this.props;

    if (sortColumn.path !== columnPath) return null;

    let classes = 'fa fa-sort-';
    classes += sortColumn.order === 'asc' ? 'asc' : 'desc';
    return <i className={classes}></i>;
  };

  render() {
    const { column } = this.props;
    return (
      <thead>
        <tr>
          {column.map((col) => (
            <th
              key={col.path || col.key}
              onClick={() => this.raiseSort(col.path)}
            >
              {col.label} {this.renderSortIcon(col.path)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
