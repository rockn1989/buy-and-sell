'use strict';

const request = require(`supertest`);
const express = require(`express`);
const offers = require(`./offers`);
const OfferService = require(`../data-service/offers-service`);
const CommentService = require(`../data-service/comments-service`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `Fg0ikD`,
    "user": `ivanov@example.com`,
    "category": [
      `Журналы`
    ],
    "comments": [
      {
        "id": `Fg0ikD`,
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

const createAPI = () => {
  const app = express();
  app.use(express.json());
  const cloneData = JSON.parse(JSON.stringify(mockData));
  offers(app, new OfferService(cloneData), new CommentService(cloneData));
  return app;
};

describe(`POSITVE`, () => {

  describe(`OFFERS: GET`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`First offer id is Fg0ikD`, () => {
      expect(response.body[0].id).toEqual(`Fg0ikD`);
    });

    test(`Get offer counts`, () => {
      expect(response.body.length).toBe(3);
    });

  });

  describe(`OFFERS: POST`, () => {
    const offer = {
      type: `offer`,
      title: `test`,
      description: `hellow world`,
      sum: 4534,
      picture: `offer-01.jpg`,
      category: [`Game`]
    };

    const app = createAPI();

    test(`Status code 201 offer when created with validate data`, async () => {
      await request(app)
        .post(`/offers`)
        .send(offer)
        .expect(HttpCode.CREATED);
    });

  });

  describe(`OFFERS: PUT`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/offers/Fg0ikD`);
    });

    test(`Update offer`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

  });

  describe(`OFFERS: DELETE`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/offers/Fg0ikD`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

  });

  describe(`COMMENTS: GET`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers/Fg0ikD/comments`);
    });

    test(`Status code 200 for comments`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });
  });

  describe(`COMMENTS: POST`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/offers/Fg0ikD/comments`)
        .send({
          id: 1,
          text: `Hello`
        });
    });

    test(`Status code 201 for comments`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
  });

  describe(`COMMENTS: DELETE`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/offers/Fg0ikD/comments/Fg0ikD`);
    });

    test(`Status code 204 for comments when deleted`, () => {
      expect(response.statusCode).toBe(HttpCode.DELETED);
    });
  });

});

describe(`NEGATIVE`, () => {

  describe(`OFFERS: GET`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers/ekjdle`);
    });

    test(`Status code 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`OFFERS: POST`, () => {
    const offer = {
      type: `offer`,
      title: `test`,
      description: `hellow world`,
      sum: 4534,
      picture: `offer-01.jpg`,
      category: [`Game`]
    };

    const app = createAPI();

    test(`No validate data offer`, async () => {
      for (const key of Object.keys(offer)) {
        const newOffer = {...offer};
        delete newOffer[key];
        await request(app)
          .post(`/offers`)
          .send(newOffer)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

  });

  describe(`OFFERS: PUT`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/offers/NOEXISTS`);
    });

    test(`Update no exists offer`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`OFFERS: DELETE`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/offers/NOEXISTS`);
    });

    test(`Delete no no exists offer`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`COMMENTS: GET`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers/NOEXISTS/comments`);
    });

    test(`Get no exists comment`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`COMMENTS: POST`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/offers/NOEXISTS/comments`)
        .send({
          id: 1,
          text: `Hello`
        });
    });

    test(`Create comment for no exists offer`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`COMMENTS: DELETE`, () => {
    const app = createAPI();

    test(`Status code 404 for no exists offer`, async () => {
      await request(app)
        .delete(`/offers/NOEXISTS/comments/NOEXISTS`)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Status code 404 for no exists comment`, async () => {
      await request(app)
        .delete(`/offers/Fg0ikD/comments/NOEXISTS`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

});
