/**
 * E2E 테스트 설정 (`npm run test:e2e`) — *.e2e-spec.ts 파일을 실행한다.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
