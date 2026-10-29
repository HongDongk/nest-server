/**
 * CreateCatDto — POST /cats 요청 본문이 "이런 모양이어야 한다"를 정의하는 클래스.
 * DTO = Data Transfer Object (데이터를 주고받을 때 쓰는 형식).
 *
 * interface가 아니라 class인 이유: 클래스는 JS로 변환된 뒤에도 남아 있어서,
 * ValidationPipe가 실행 중에 아래 데코레이터(규칙)를 읽고 검사할 수 있다.
 */
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCatDto {
  @IsString({ message: 'name은 문자열이어야 합니다' })
  @IsNotEmpty({ message: 'name은 비어 있을 수 없습니다' })
  name: string;

  @IsInt({ message: 'age는 정수여야 합니다' })
  @Min(0, { message: 'age는 0 이상이어야 합니다' })
  @Max(30, { message: 'age는 30 이하여야 합니다' })
  age: number;
}
