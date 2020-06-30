import React, { Component } from 'react';

class TableHeader extends Component {
  render() {
    const { column } = this.props;

    return (
      <thead>
        <tr>
          {column.map((col) => (
            <th key={column.path || column.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
