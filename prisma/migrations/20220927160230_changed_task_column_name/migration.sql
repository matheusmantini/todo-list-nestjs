/*
  Warnings:

  - You are about to drop the column `user_id` on the `Task` table. All the data in the column will be lost.
  - Added the required column `creator_user_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_user_id_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "user_id",
ADD COLUMN     "creator_user_id" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
