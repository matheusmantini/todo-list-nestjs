import { Exclude, Expose } from 'class-transformer';
export class User {
  @Exclude()
  id: string;
  @Expose()
  name: string;
  @Expose()
  nickname: string;
  @Exclude()
  email: string;
}
