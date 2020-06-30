import React from 'react';
import TableHeader from './tableHeader';
import TableBody from './tableBody';

const Table = ({ column, data, sortColumn, onSort }) => {
  return (
    <table className="table table-dark">
      <TableHeader column={column} sortColumn={sortColumn} onSort={onSort} />
      <TableBody column={column} data={data} />
    </table>
  );
};

export default Table;
