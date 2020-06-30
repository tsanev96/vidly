import React from 'react';

const ListGroup = ({ data, selectedItem, onItemSelect }) => {
  return (
    <ul className="list-group">
      {data.map((item) => (
        <li
          key={item._id || item.key}
          className={
            item === selectedItem ? 'list-group-item active' : 'list-group-item'
          }
          onClick={() => onItemSelect(item)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
