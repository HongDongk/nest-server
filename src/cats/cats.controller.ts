/**
 * Cats 컨트롤러 — /cats 주소로 오는 요청을 담당.
 *   GET  /cats         → 전체 목록 (?age=2 로 나이 필터)
 *   GET  /cats/:id     → 하나 조회
 *   POST /cats         → 새로 추가 (JSON 본문)
 * 직접 데이터를 다루지 않고 CatsService에 일을 넘긴다.
 * 잘못된 입력은 BadRequestException(400)을 던진다 → HttpExceptionFilter가 응답 모양을 통일.
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CatsService, type Cat } from './cats.service.js';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(@Query('age') age?: string) {
    return this.catsService.findAll(age ? Number(age) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const n = Number(id);
    if (!Number.isInteger(n) || n < 0) {
      throw new BadRequestException('id는 0 이상의 정수여야 합니다'); // → 400
    }
    return this.catsService.findOne(n); // 없으면 서비스에서 404를 던진다
  }

  @Post()
  create(@Body() cat: Cat) {
    if (!cat?.name || typeof cat.age !== 'number') {
      // 간단한 수동 검증. 나중에 Pipes 장에서 DTO + ValidationPipe로 대체할 예정
      throw new BadRequestException('name(문자열)과 age(숫자)가 필요합니다');
    }
    return this.catsService.create(cat);
  }
}
