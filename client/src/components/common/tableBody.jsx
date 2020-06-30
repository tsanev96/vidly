import React, { Component } from 'react';
import _ from 'lodash';

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);

    return _.get(item, column.path);
  };

  renderKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  render() {
    const { column, data } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {column.map((column) => (
              <td key={this.renderKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
