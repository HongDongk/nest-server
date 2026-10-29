/**
 * Cats 컨트롤러 — /cats 주소로 오는 요청을 담당.
 *   GET  /cats         → 전체 목록 (?age=2 로 나이 필터)
 *   GET  /cats/:id     → 하나 조회
 *   POST /cats         → 새로 추가 (JSON 본문)
 * 직접 데이터를 다루지 않고 CatsService에 일을 넘긴다.
 * 입력 검사/변환은 파이프(ParseIdPipe, ParseIntPipe, ValidationPipe)가 담당 → 실패 시 400.
 */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CatsService } from './cats.service.js';
import { CreateCatDto } from './dto/create-cat.dto.js';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe.js';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  // 내장 파이프: "2" → 2 로 변환. 숫자가 아니면 400. optional이라 ?age 없이 와도 OK
  findAll(@Query('age', new ParseIntPipe({ optional: true })) age?: number) {
    return this.catsService.findAll(age);
  }

  @Get(':id')
  // 커스텀 파이프: id 검사/변환은 파이프가 끝내고, 여기엔 이미 숫자가 들어온다
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.catsService.findOne(id); // 없으면 서비스에서 404를 던진다
  }

  @Post()
  // 전역 ValidationPipe가 CreateCatDto의 규칙으로 본문을 검사한다. 통과해야만 이 코드가 실행됨
  create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }
}
