import { Exclude, Expose } from 'class-transformer';
export class AllUsers {
  @Expose()
  id: string;
  @Exclude()
  name: string;
  @Expose()
  nickname: string;
  @Exclude()
  email: string;
}
