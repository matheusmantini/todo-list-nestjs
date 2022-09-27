import { Exclude, Expose } from 'class-transformer';
export class CreateUser {
  @Exclude()
  id: string;
  @Expose()
  name: string;
  @Expose()
  nickname: string;
  @Expose()
  email: string;
}
