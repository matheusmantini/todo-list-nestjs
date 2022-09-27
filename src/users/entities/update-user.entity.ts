import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
export class UpdateUser {
  @Exclude()
  id: string;
  @Expose()
  @IsOptional()
  name?: string;
  @Expose()
  @IsOptional()
  nickname?: string;
  @Exclude()
  email: string;
}
