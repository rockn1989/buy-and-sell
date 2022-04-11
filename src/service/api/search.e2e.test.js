'use strict';

const request = require(`supertest`);
const express = require(`express`);
const search = require(`./search`);
const SearchService = require(`../data-service/search-service`);
const {HttpCode} = require(`../../constants`);

const app = express();
app.use(express.json());

const mockData = [
  {
    "id": `Fg0ikD`,
    "user": `ivanov@example.com`,
    "category": [
      `Журналы`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`
      }
    ],
    "description": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5`,
    "type": `SALE`,
    "sum": 79555
  },
  {
    "id": `E7qAM5`,
    "user": `petrov@example.com`,
    "category": [
      `Игры`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Неплохо, но дорого. Совсем немного... Оплата наличными или перевод на карту?`
      },
      {
        "user": `petrov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Неплохо, но дорого. Совсем немного...`
      },
      {
        "user": `petrov@example.com`,
        "text": `Вы что?! В магазине дешевле.`
      }
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Даю недельную гарантию. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "picture": `item02.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 55460
  },
  {
    "id": `lVQQlp`,
    "user": `ivanov@example.com`,
    "category": [
      `Животные`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      }
    ],
    "description": `Даю недельную гарантию. Продаю с болью в сердце... Товар в отличном состоянии. Если найдёте дешевле — сброшу цену.`,
    "picture": `item12.jpg`,
    "title": `Куплю породистого кота`,
    "type": `SALE`,
    "sum": 81801
  }
];

search(app, new SearchService(mockData));

describe(`SEARCH: POSITIVE`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({query: `Продам`});
  });

  test(`Status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`2 offer found`, () => {
    expect(response.body.length).toBe(2);
  });

  test(`Offer has correct ID`, () => {
    expect(response.body[0].id).toBe(`Fg0ikD`);
  });

});


describe(`SEARCH: NEGATIVE`, () => {

  test(`Status code 404`,
      () => request(app)
        .get(`/search`)
        .query({query: `Продам23`})
        .expect(HttpCode.NOT_FOUND)
  );

  test(`Bad request`,
      () => request(app)
        .get(`/search`)
        .expect(HttpCode.BAD_REQUEST)
  );
});
