/**
 * Cats 서비스(Provider) — 고양이 데이터를 저장하고 조회하는 실제 로직.
 * 지금은 DB 없이 메모리 배열에 저장하므로 서버를 재시작하면 데이터가 사라진다.
 * 싱글톤이라 앱 전체에서 이 인스턴스 하나를 공유한다.
 */
import { Injectable } from '@nestjs/common';

export interface Cat {
  name: string;
  age: number;
}

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
    return cat;
  }

  findAll(age?: number) {
    return age ? this.cats.filter(c => c.age === age) : this.cats;
  }

  findOne(id: number) {
    return this.cats[id];
  }
}