/**
 * 루트 컨트롤러 — '주문 받는 직원'.
 * GET / 요청을 받아서 AppService에 일을 맡기고, 그 결과를 응답으로 돌려준다.
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
