import { Expose } from "class-transformer";

export class UpdateMultResponsiblesTask {
  @Expose()
  task_id: string;
  @Expose()
  user_responsible_id: string[];
}
