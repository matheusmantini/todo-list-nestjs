import { Exclude, Expose } from 'class-transformer';
export class UpdateUser {
  @Exclude()
  id: string;
  @Expose()
  name: string;
  @Expose()
  nickname: string;
  @Exclude()
  email: string;
}
