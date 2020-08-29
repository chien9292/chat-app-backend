import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { GroupEntity } from '../src/entities/group.entity';
import { UserEntity } from '../src/entities/user.entity';

const userEmail = 'testgroup@gmail.com';
const password = 'testpassword';
const groupName = 'Test Group Name';
const updatedGroupName = "Test Updated Group Name";

describe('Group', () => {
  let app: INestApplication;
  let repository: Repository<GroupEntity>;
  let userRepository: Repository<UserEntity>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    repository = module.get('GroupEntityRepository');
    userRepository = module.get('UserEntityRepository');
    await app.init();
  });

  afterAll(async () => {
    await repository.query(`DELETE FROM chat_app.group WHERE (name = '${updatedGroupName}')`);
    await repository.query(`DELETE FROM chat_app.user WHERE (email = '${userEmail}')`);
    await app.close();
  });

  describe('CRUD Group', () => {
    it('should create a group in the DB', async () => {
      await supertest(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: userEmail, password: password, confirmPassword: password })
        .expect(201);
      const user = await userRepository.findOne({ email: userEmail })

      const group = await repository.create({
        creatorId: user.id,
        name: groupName,
      })
      await repository.save(group);
      await expect(group).toMatchObject(
        {
          createdDate: expect.any(Date),
          creatorId: user.id,
          name: groupName,
          id: expect.any(String),
          isActive: true,
          type: 1
        });
    });
    it('should return group(s) that the member is in', async () => {
      const user = await userRepository.findOne({ email: userEmail })
      var result = await repository.find({creatorId:user.id});
      const parsedData = JSON.stringify(result);
      const groupList = JSON.parse(parsedData);
      groupList.forEach(group => {
        expect(group).toMatchObject({
          createdDate: expect.any(String),
          creatorId: expect.any(String),
          id: expect.any(String),
          isActive: expect.any(Boolean),
          name: expect.any(String),
          type: expect.any(Number),
        });
      });
    });
    it('should update a group and verify it in the DB', async () => {
      var group = await repository.findOne({ name: groupName })
      await repository.update(group.id,{name:updatedGroupName});
      group = await repository.findOne({ name: updatedGroupName })
      expect(group).toMatchObject({
        createdDate: expect.any(Date),
        creatorId: expect.any(String),
        id: expect.any(String),
        isActive: expect.any(Boolean),
        name: expect.any(String),
        type: expect.any(Number),
      });
    });
    it('should delete a group', async () => {
      const result = await repository.delete({ name: updatedGroupName })
      expect(result.raw).toMatchObject({
        affectedRows: 1,
        serverStatus: 2,
      });
    });
  });
});
