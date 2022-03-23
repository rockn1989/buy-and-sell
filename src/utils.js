'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [array[i], array[randomPosition]] = [
      array[randomPosition],
      array[i]
    ];
  }

  return array;
};

const getRandomPictureName = () => {
  const randomIndex = getRandomInt(1, 16);
  const pictureName = randomIndex >= 10 ? `item${randomIndex}.jpg` : `item0${randomIndex}.jpg`;
  return pictureName;
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomPictureName
};
