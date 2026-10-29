/**
 * E2E(끝에서 끝까지) 테스트 (`npm run test:e2e`로 실행).
 * 실제 앱 전체(AppModule)를 띄우고, 진짜 HTTP 요청(GET /)을 보내서 응답을 확인한다.
 * 단위 테스트(*.spec.ts)가 부품 하나를 검사한다면, 이건 완성품을 검사하는 것.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
