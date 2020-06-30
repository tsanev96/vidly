import React from 'react';

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = [...Array(pagesCount).keys()].map((x) => x + 1);

  return (
    <ul className="pagination">
      {pages.map((page) => (
        <li
          key={page}
          className={page === currentPage ? 'page-item active' : 'page-item'}
          onClick={() => onPageChange(page)}
        >
          <a to="" className="page-link">
            {page}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
