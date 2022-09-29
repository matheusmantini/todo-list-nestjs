import { Exclude, Expose } from "class-transformer";

export class TasksResponsibles {
  @Exclude()
  id: string;
  @Exclude()
  task_id: string;
  @Expose()
  responsible_id: string;
  @Expose()
  nickname: string;
}
