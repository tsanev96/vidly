import React from 'react';

const Like = ({ liked, item, onLike }) => {
  let classes = 'fa fa-heart';
  classes += liked ? '' : '-o';

  return (
    <i
      onClick={() => onLike(item)}
      className={classes}
      style={{ cursor: 'pointer' }}
    ></i>
  );
};

export default Like;
