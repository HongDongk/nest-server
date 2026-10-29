/**
 * CatsController 단위 테스트 (CLI가 자동 생성한 기본 틀).
 * 컨트롤러가 정상적으로 만들어지는지만 확인한다.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller.js';

describe('CatsController', () => {
  let controller: CatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
