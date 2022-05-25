'use strict';

const path = require(`path`);
const {nanoid} = require(`nanoid`);
const multer = require(`multer`);

const FILES_TYPE = [`image/png`, `image/jpg`, `image/jpeg`];
const UPLOAD_DIR = `../upload/img`;

const uploadAbsoluteDir = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadAbsoluteDir);
  },
  filename: (req, file, cb) => {
    console.log(file);
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
  fileFilter: [`png`, `jpeg`]
});

const fileFilter = (req, file, cb) => {
  if (FILES_TYPE.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({storage, fileFilter});
