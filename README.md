# nest-server — NestJS 학습 노트

NestJS 공식 문서(한국어 번역: https://nestjs.burt.pe.kr)를 따라가며 실습한 프로젝트입니다.
지금까지 다룬 장: **Controllers → Providers → Modules → Middleware**

---

## 한눈에 보기

식당에 비유하면:

| Nest 개념 | 식당 비유 | 하는 일 |
|---|---|---|
| **Middleware** | 입구 경비원 | 요청이 들어오면 제일 먼저 확인 (로그, 인증 등) |
| **Controller** | 주문 받는 직원 | "어떤 주소로 어떤 요청이 오면 무엇을 돌려줄지" 결정 |
| **Provider (Service)** | 주방장 | 실제 로직 처리 (데이터 저장/조회 등) |
| **Module** | 부서 (한식 코너, 양식 코너) | 관련된 컨트롤러·서비스를 한 묶음으로 관리 |

요청이 흘러가는 순서:

```
요청 → [Middleware] → [Controller] → [Service] → 응답
```

---

## 1. Controller — 요청 받고 응답 돌려주기

**어떤 주소(경로) + 어떤 HTTP 메서드로 요청이 오면 어떤 함수를 실행할지** 정하는 클래스.
직접 로직을 처리하지 않고 서비스에 일을 맡긴다.

| 데코레이터 | 뜻 | 예시 |
|---|---|---|
| `@Controller('cats')` | 이 클래스는 `/cats`로 시작하는 주소 담당 | |
| `@Get()` `@Post()` `@Put()` `@Delete()` | HTTP 메서드별 처리 함수 | `GET /cats` |
| `@Param('id')` | 주소 속 값 | `/cats/3` → `"3"` |
| `@Query('age')` | `?` 뒤의 값 | `/cats?age=2` → `"2"` |
| `@Body()` | 요청 본문(JSON) | `{ "name": "나비" }` |

- 객체/배열을 `return`하면 Nest가 자동으로 JSON 응답을 만든다.
- `@Param`, `@Query` 값은 **항상 문자열**로 들어온다 → 숫자가 필요하면 `Number()` 변환.
- CLI로 생성: `npx nest g controller cats`

```ts
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(Number(id));
  }
}
```

---

## 2. Provider — 실제 일을 하는 클래스 + 의존성 주입(DI)

`@Injectable()`이 붙은 클래스. 서비스(Service)가 가장 대표적인 Provider.

- **의존성 주입(DI)**: 생성자에 타입만 적으면 Nest가 객체를 대신 만들어서 넣어준다. `new`를 직접 쓰지 않는다.
  ```ts
  constructor(private readonly catsService: CatsService) {}
  ```
- **싱글톤**: 기본적으로 앱 전체에서 인스턴스 **하나**를 공유한다.
- 모듈의 `providers`에 등록해야 주입 가능. 안 하면 `Nest can't resolve dependencies...` 에러.
- **왜 나누나?** 컨트롤러는 요청/응답만, 서비스는 로직만 → 코드가 깔끔하고 테스트할 때 가짜 서비스로 바꿔 끼우기 쉽다.
- CLI로 생성: `npx nest g service cats`

---

## 3. Module — 관련 코드를 묶는 상자

`@Module()`이 붙은 클래스. 앱은 모듈들을 조립해서 만든다.

| 속성 | 뜻 |
|---|---|
| `controllers` | 이 모듈의 컨트롤러 |
| `providers` | 이 모듈 안에서 쓰는 서비스 |
| `imports` | 가져다 쓸 다른 모듈 |
| `exports` | 다른 모듈에 **빌려줄** 서비스 (안 적으면 모듈 밖에서 못 씀) |

- **루트 모듈**(`AppModule`): 시작점. 여기서 `imports`를 따라 앱 전체 구조가 만들어진다.
- **기능 모듈**(`CatsModule`): 기능 하나를 통째로 묶은 모듈.
- `@Global()`: import 없이 어디서든 사용 가능 — 남발 금지.
- 동적 모듈(`forRoot()` 등): 설정값을 받아 모듈을 만드는 방식. DB/Config 붙일 때 다시 나옴.
- ⚠️ 같은 서비스를 두 모듈의 `providers`에 중복 등록하면 인스턴스가 2개 생겨 데이터가 따로 논다.
- CLI로 생성: `npx nest g module cats`

---

## 4. Middleware — 컨트롤러 전에 실행되는 함수

요청이 컨트롤러에 도착하기 **전에** 거쳐가는 함수. 할 수 있는 것:

1. 요청/응답을 보거나 수정 (로그, 헤더 추가)
2. 직접 응답하고 끝내기 (예: 인증 실패 → 401)
3. `next()`로 다음 단계로 넘기기 — ⚠️ **빼먹으면 요청이 멈춤**

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.method, req.originalUrl);
    next();
  }
}
```

등록은 `@Module()` 안이 아니라 모듈의 `configure()`에서:

```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path'); // 'cats'로 바꾸면 /cats만
  }
}
```

- `forRoutes()`: 적용 경로 / `exclude()`: 제외 경로 / `apply(A, B)`: 여러 개 순서대로
- 주입받을 게 없으면 클래스 대신 **함수형 미들웨어**로 써도 된다.
- `main.ts`의 `app.use()`로 전역 적용 가능 (단, DI 불가)

---

## 프로젝트 구조

```
src/
├── main.ts                     # 앱 시작점. AppModule로 앱을 만들고 3000번 포트 오픈
├── app.module.ts               # 루트 모듈 + 미들웨어 등록(configure)
├── app.controller.ts           # GET / → "Hello World!"
├── app.service.ts              # AppController가 쓰는 서비스
├── common/
│   └── middleware/
│       └── logger.middleware.ts  # 모든 요청 로그 (메서드, 주소, 상태코드, 시간)
└── cats/
    ├── cats.module.ts          # Cats 기능 모듈
    ├── cats.controller.ts      # /cats 요청 처리
    └── cats.service.ts         # 고양이 데이터 (메모리 배열, 재시작하면 사라짐)
test/
└── app.e2e-spec.ts             # 앱 전체를 띄워서 실제 HTTP 요청으로 테스트
*.spec.ts                       # 단위 테스트 (부품 하나씩)
```

---

## 실행 & 요청 보내기

```bash
npm i                 # 의존성 설치
npm run start:dev     # 개발 서버 (코드 바꾸면 자동 재시작)
npm test              # 단위 테스트
npm run test:e2e      # E2E 테스트
```

서버를 켠 상태에서 **다른 터미널**에서:

```bash
# 추가 (POST + JSON)
curl -X POST http://localhost:3000/cats \
  -H "Content-Type: application/json" \
  -d '{"name":"나비","age":2}'

curl http://localhost:3000/cats          # 목록
curl "http://localhost:3000/cats?age=2"  # 나이 필터
curl http://localhost:3000/cats/0        # 하나 조회
curl -i http://localhost:3000/cats       # -i: 상태코드·헤더까지 보기
```

GET 요청은 브라우저 주소창에 `http://localhost:3000/cats`를 입력해도 된다.

---

## 겪었던 문제 & 해결

| 문제 | 원인 | 해결 |
|---|---|---|
| `npm i` 실패: `Cannot read properties of null (reading 'edgesOut')` | npm 10.x 버그 (vitest 4 peer 의존성 계산 중 크래시) | `.npmrc`에 `legacy-peer-deps=true` 추가, 또는 npm 11로 업그레이드(`npm i -g npm@11`) 후 `.npmrc` 삭제 |
| `@Body() cat: Cat`에서 TS1272 경고 | `Cat`이 interface(타입 전용)인데, 데코레이터 메타데이터 + `isolatedModules` 설정 때문에 타입임을 명시해야 함 | `import { type Cat }`으로 import. 또는 interface 대신 **DTO 클래스** 사용 (Nest 권장) |
| import 경로에 `.js` 필요 | 이 프로젝트는 ESM(`"type": "module"`) | `./cats.service.js`처럼 확장자 `.js` 붙이기 (`.ts` 파일이어도) |
| `cats.controller.spec.ts` 테스트 실패 | 컨트롤러가 `CatsService`를 필요로 하는데 테스트 모듈에 없음 | `Test.createTestingModule({ controllers: [...], providers: [CatsService] })` |

---

## 다음에 볼 것

- [ ] Exception filters — 에러 응답 모양 만들기
- [ ] Pipes — 입력값 변환/검증 (DTO + `ValidationPipe`)
- [ ] Guards — 인증/권한
- [ ] Interceptors — 응답 가공, 실행 시간 측정
