import React from 'react';
import TableHeader from './tableHeader';
import TableBody from './tableBody';

const Table = ({ column, data }) => {
  return (
    <table className="table table-dark">
      <TableHeader column={column} />
      <TableBody column={column} data={data} />
    </table>
  );
};

export default Table;
