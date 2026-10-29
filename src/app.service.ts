/**
 * 루트 서비스(Provider) — '주방장'.
 * 실제 로직이 들어가는 곳. @Injectable()이 붙어 있어서 Nest가 객체를 만들어 컨트롤러에 주입해 준다.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
