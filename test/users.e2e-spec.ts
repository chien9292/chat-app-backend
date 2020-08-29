import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { UserEntity } from '../src/entities/user.entity';
const userEmail = 'testemail@gmail.com';
const password = 'testpassword';

describe('User', () => {
  let app: INestApplication;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    repository = module.get('UserEntityRepository');
    await app.init();
  });

  afterAll(async () => {
    await repository.query(`DELETE FROM chat_app.user WHERE (email = '${userEmail}')`);
    await app.close();
  });

  describe('CRUD User', () => {
    it('should create a user in the DB', async () => {
      await supertest(app.getHttpServer())
        .post('/users')
        .send({ email: userEmail, password })
        .expect(201);
      const user = await repository.findOne({ email: userEmail })
      const { body } = await supertest(app.getHttpServer())
        .get('/users/' + user.id)
        .expect(200);
      expect(body.data).toEqual({
        avatar: null,
        createdDate: expect.any(String),
        email: expect.any(String),
        fullname: null,
        id: expect.any(String),
        isActive: true,
        password: expect.any(String),
        roleId: 2,
      });
    });
    it('should return an array of users', async () => {
      const { body } = await supertest(app.getHttpServer())
        .get('/users/')
        .expect(200);
      const parsedData = JSON.stringify(body.data);
      const userList = JSON.parse(parsedData);
      userList.forEach(user => {
        expect(user).toMatchObject({
          createdDate: expect.any(String),
          email: expect.any(String),
          id: expect.any(String),
          isActive: true,
          password: expect.any(String),
          roleId: 2,
        });
      });
    });
    it('should update a user and verify it in the DB', async () => {
      const user = await repository.findOne({ email: userEmail })
      const updatedAvatar = "lulavatar"
      const updatedName = "lulName"
      await supertest(app.getHttpServer())
        .put('/users/' + user.id)
        .send({
          fullname: updatedName
          , avatar: updatedAvatar
        })
        .expect(200);

      const { body } = await supertest(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);
      expect(body.data).toEqual(
        {
          avatar: updatedAvatar,
          fullname: updatedName,
          createdDate: expect.any(String),
          id: expect.any(String),
          isActive: true,
          password: expect.any(String),
          roleId: 2,
          email: userEmail

        },
      );
    });
    it('should delete a user', async () => {
      const user = await repository.findOne({ email: userEmail })
      await supertest(app.getHttpServer())
        .delete('/users/' + user.id)
        .expect(200);
    });
  });
});
