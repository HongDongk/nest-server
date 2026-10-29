/**
 * Cats 컨트롤러 — /cats 주소로 오는 요청을 담당.
 *   GET  /cats         → 전체 목록 (?age=2 로 나이 필터)
 *   GET  /cats/:id     → 하나 조회
 *   POST /cats         → 새로 추가 (JSON 본문)
 * 직접 데이터를 다루지 않고 CatsService에 일을 넘긴다.
 */
import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
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
    return this.catsService.findOne(Number(id)) ?? { message: '없음' };
  }

  @Post()
  create(@Body() cat: Cat) {
    return this.catsService.create(cat);
  }
}