/*
  Warnings:

  - You are about to drop the column `subject` on the `School_timetable` table. All the data in the column will be lost.
  - The `final_day` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Admin_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parent_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToTeacher_data` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `staffuserId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_message_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_price_record_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin_data" DROP CONSTRAINT "Admin_data_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Parent_data" DROP CONSTRAINT "Parent_data_parent_message_id_fkey";

-- DropForeignKey
ALTER TABLE "Parent_data" DROP CONSTRAINT "Parent_data_parent_price_record_id_fkey";

-- DropForeignKey
ALTER TABLE "Parent_data" DROP CONSTRAINT "Parent_data_parent_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_student_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_student_parent_data_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_student_teacher_data_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher_data" DROP CONSTRAINT "Teacher_data_teacher_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher_time_work" DROP CONSTRAINT "Teacher_time_work_teacher_time_work_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher_upload_node" DROP CONSTRAINT "Teacher_upload_node_teacher_data_id_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToTeacher_data" DROP CONSTRAINT "_CourseToTeacher_data_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToTeacher_data" DROP CONSTRAINT "_CourseToTeacher_data_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeacherNode" DROP CONSTRAINT "_TeacherNode_B_fkey";

-- DropIndex
DROP INDEX "Booklist_name_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "staffuserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "School_timetable" DROP COLUMN "subject";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "final_day",
ADD COLUMN     "final_day" TIMESTAMP(3),
ALTER COLUMN "teachers" DROP NOT NULL,
ALTER COLUMN "student_parent_data_id" DROP NOT NULL,
ALTER COLUMN "student_class_id" DROP NOT NULL,
ALTER COLUMN "student_teacher_data_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_message_id" TEXT NOT NULL,
ADD COLUMN     "parent_price_record_id" TEXT NOT NULL,
ADD COLUMN     "parent_user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Admin_data";

-- DropTable
DROP TABLE "Parent_data";

-- DropTable
DROP TABLE "Teacher_data";

-- DropTable
DROP TABLE "_CourseToTeacher_data";

-- CreateTable
CREATE TABLE "StaffUser" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "cram" TEXT NOT NULL,
    "subject" TEXT[],
    "teacher_time_work_id" TEXT NOT NULL,
    "teacher_upload_node_id" TEXT NOT NULL,
    "teacher_user_id" TEXT NOT NULL,
    "teacher_node_id" TEXT NOT NULL,

    CONSTRAINT "StaffUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Price_recordToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MessageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToStaffUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_username_key" ON "StaffUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_cram_key" ON "StaffUser"("cram");

-- CreateIndex
CREATE UNIQUE INDEX "_Price_recordToUser_AB_unique" ON "_Price_recordToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_Price_recordToUser_B_index" ON "_Price_recordToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MessageToUser_AB_unique" ON "_MessageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageToUser_B_index" ON "_MessageToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToStaffUser_AB_unique" ON "_CourseToStaffUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToStaffUser_B_index" ON "_CourseToStaffUser"("B");

-- CreateIndex
CREATE INDEX "Ex_pager_school_ex_pager_id_grade_subject_year_quarter_idx" ON "Ex_pager"("school_ex_pager_id", "grade", "subject", "year", "quarter");

-- CreateIndex
CREATE INDEX "Ex_scope_school_ex_scope_id_grade_quarter_subject_idx" ON "Ex_scope"("school_ex_scope_id", "grade", "quarter", "subject");

-- CreateIndex
CREATE INDEX "Ex_timetable_school_ex_time_id_grade_year_quarter_subject_idx" ON "Ex_timetable"("school_ex_time_id", "grade", "year", "quarter", "subject");

-- CreateIndex
CREATE INDEX "School_timetable_school_school_timetable_id_grade_year_quar_idx" ON "School_timetable"("school_school_timetable_id", "grade", "year", "quarter");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_staffuserId_fkey" FOREIGN KEY ("staffuserId") REFERENCES "StaffUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_student_class_id_fkey" FOREIGN KEY ("student_class_id") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_student_parent_data_id_fkey" FOREIGN KEY ("student_parent_data_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_student_teacher_data_id_fkey" FOREIGN KEY ("student_teacher_data_id") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher_time_work" ADD CONSTRAINT "Teacher_time_work_teacher_time_work_id_fkey" FOREIGN KEY ("teacher_time_work_id") REFERENCES "StaffUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher_upload_node" ADD CONSTRAINT "Teacher_upload_node_teacher_data_id_fkey" FOREIGN KEY ("teacher_data_id") REFERENCES "StaffUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Price_recordToUser" ADD CONSTRAINT "_Price_recordToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Price_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Price_recordToUser" ADD CONSTRAINT "_Price_recordToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToUser" ADD CONSTRAINT "_MessageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToUser" ADD CONSTRAINT "_MessageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStaffUser" ADD CONSTRAINT "_CourseToStaffUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStaffUser" ADD CONSTRAINT "_CourseToStaffUser_B_fkey" FOREIGN KEY ("B") REFERENCES "StaffUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherNode" ADD CONSTRAINT "_TeacherNode_B_fkey" FOREIGN KEY ("B") REFERENCES "StaffUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
