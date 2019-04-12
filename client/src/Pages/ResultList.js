import React from 'react';
import Masonry from 'react-masonry-component';

import { ResultCard } from '../Libraries/ComponentsLibrary';

var masonryOptions = {
    transitionDuration: ".5s"
};

const ResultList = (props) => {

  const { entries } = props;
  const listItems = entries.map((entry) =>
    <ResultCard
      key={entry["entry_id"]}
      entry={entry}
      />);

  return (
    <Masonry className="defs" options={masonryOptions}>{listItems}</Masonry>
  );
}

export default ResultList;
