/**
 * CatsService 단위 테스트 (CLI가 자동 생성한 기본 틀).
 * 서비스가 정상적으로 만들어지는지만 확인한다.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service.js';

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
