/**
 * ParseIdPipe — 직접 만든 커스텀 파이프.
 * 주소의 id(항상 문자열로 들어옴)를 "0 이상의 정수"로 변환하고, 아니면 400 에러를 던진다.
 *
 * 파이프 = 컨트롤러 메서드가 실행되기 "직전"에 인자를 검사(validation)하거나 변환(transformation)하는 클래스.
 * 사용: @Param('id', ParseIdPipe) id: number
 */
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  // value: 들어온 값 ("3"), 반환값이 컨트롤러 메서드의 인자가 된다 (3)
  transform(value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 0) {
      throw new BadRequestException(
        `id는 0 이상의 정수여야 합니다 (받은 값: ${value})`,
      );
    }
    return id;
  }
}
