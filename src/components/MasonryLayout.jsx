import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {pins?.map((pin) => {
        const key = pin._id || pin.id;
        return <Pin key={key} pin={{ ...pin, _id: key }} />;
      })}
    </Masonry>
  );
};

export default MasonryLayout;
