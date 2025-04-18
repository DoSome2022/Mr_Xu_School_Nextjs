/*
  Warnings:

  - You are about to drop the column `teacher_user_id` on the `StaffUser` table. All the data in the column will be lost.
  - You are about to drop the column `parent_user_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StaffUser" DROP COLUMN "teacher_user_id",
ADD COLUMN     "ISADMIN" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "cram" DROP NOT NULL,
ALTER COLUMN "teacher_time_work_id" DROP NOT NULL,
ALTER COLUMN "teacher_upload_node_id" DROP NOT NULL,
ALTER COLUMN "teacher_node_id" DROP NOT NULL,
ALTER COLUMN "Staff" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "parent_user_id",
ALTER COLUMN "role" SET DEFAULT 'PARENT',
ALTER COLUMN "parent_message_id" DROP NOT NULL,
ALTER COLUMN "parent_price_record_id" DROP NOT NULL;
