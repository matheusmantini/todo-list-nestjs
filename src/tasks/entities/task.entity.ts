import { Exclude, Expose } from "class-transformer";
import { IsDate } from "class-validator";

export class Task {
  @Exclude()
  id: string;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Exclude()
  status: string;
  @Expose()
  @IsDate()
  limitDate: Date;
  @Expose()
  creatorUserId: string;
}
