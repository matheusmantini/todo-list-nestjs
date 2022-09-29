import { Exclude, Expose } from "class-transformer";

export class TasksResponsible {
  @Exclude()
  id: string;
  @Expose()
  task_id: string;
  @Expose()
  responsible_user_id: string;
}
