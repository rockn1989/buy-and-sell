'use strict';
const fs = require(`fs/promises`);

const {getRandomInt, shuffle, getRandomPictureName} = require(`../../utils`);
const {
  MIN_POST,
  MAX_POST,
  PATH_OF_TITLES,
  PATH_OF_DESCRIPTIONS,
  PATH_OF_CATEGORIES,
  ExitCode} = require(`../../constants`);

const asyncReadFile = async (filePath) => {
  try {
    const fileData = await fs.readFile(filePath, `utf8`);
    return fileData.trim().split(`\n`);
  } catch (err) {
    console.info(err);
    return [];
  }
};

const generatePost = async (count, titles, descriptions, categories) => {
  return Array(count).fill({}).map(() => ({
    type: getRandomInt(0, 1) === 1 ? `offer` : `sale`,
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(descriptions).slice(0, getRandomInt(0, descriptions.length - 1)).join(` `),
    sum: getRandomInt(1000, 10000),
    picture: getRandomPictureName(),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1))
  }));
};

module.exports = {
  name: `--generate`,
  run: async (argv) => {
    const count = parseInt(argv, 10) || MIN_POST;

    if (count > MAX_POST) {
      console.error(`Не более 1000 объявлений`);
      process.exit(ExitCode.ERROR);
    }

    const titles = await asyncReadFile(PATH_OF_TITLES);
    const descriptions = await asyncReadFile(PATH_OF_DESCRIPTIONS);
    const categories = await asyncReadFile(PATH_OF_CATEGORIES);

    const posts = await generatePost(count, titles, descriptions, categories);

    try {
      await fs.writeFile(`mocks.json`, JSON.stringify(posts));
      console.info(`File created`);
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.info(err);
      process.exit(ExitCode.ERROR);
    }
  }
};
