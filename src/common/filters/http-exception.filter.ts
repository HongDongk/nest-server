/**
 * HTTP 예외 필터 — 앱 어디서든 HttpException(NotFoundException, BadRequestException 등)이
 * 던져지면 여기로 모인다. 에러 응답의 "모양"을 한 곳에서 통일하는 역할.
 *
 * 기본 응답:  { "statusCode": 404, "message": "...", "error": "Not Found" }
 * 이 필터 후: { "success": false, "statusCode": 404, "message": "...", "path": "/cats/9", "timestamp": "..." }
 *
 * 등록은 AppModule의 providers에 APP_FILTER로 (전역 적용).
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException) // 이 필터가 잡을 예외 종류. 비워두면(@Catch()) 모든 예외를 잡는다
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    // host: 현재 요청의 실행 컨텍스트. HTTP 요청이니 switchToHttp()로 req/res를 꺼낸다
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const body = exception.getResponse(); // throw할 때 넘긴 메시지(문자열 또는 객체)
    const message =
      typeof body === 'string' ? body : (body as { message?: unknown }).message;

    this.logger.warn(
      `${req.method} ${req.originalUrl} → ${status} ${String(message)}`,
    );

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
