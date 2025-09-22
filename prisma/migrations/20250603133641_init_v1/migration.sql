/*
  Warnings:

  - You are about to drop the column `classId` on the `AddClass` table. All the data in the column will be lost.
  - You are about to drop the column `classroom` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `course_level` on the `Course` table. All the data in the column will be lost.
  - The `teacher` column on the `Node` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `final_day` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `student_class_id` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `student_school_timetable` table. All the data in the column will be lost.
  - You are about to drop the `AttendRollCall` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentclassId` to the `AddClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `AddClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetclassId` to the `AddClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AddClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applystate` to the `Apply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `Apply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_name` to the `Apply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_id` to the `Apply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Apply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Apply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Apply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_subject` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isshow` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TimeTemplateID` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_end` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_start` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `days` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isshow` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekdays` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ex_pager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ex_scope` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ex_timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Price_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Course_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `School_timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StaffUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ismember` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issurvive` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_time_work_id` to the `Teacher_time_work` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Teacher_time_work` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Teacher_time_work` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Teacher_upload_node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_booklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_ex_paper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_ex_scope` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_ex_timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_school_timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `student_score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AddClass" DROP CONSTRAINT "AddClass_classId_fkey";

-- DropForeignKey
ALTER TABLE "AttendRollCall" DROP CONSTRAINT "AttendRollCall_attendRollCall_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_student_class_id_fkey";

-- DropIndex
DROP INDEX "AddClass_studentId_key";

-- DropIndex
DROP INDEX "Apply_apply_student_id_key";

-- DropIndex
DROP INDEX "Apply_title_key";

-- DropIndex
DROP INDEX "Class_class_course_id_key";

-- DropIndex
DROP INDEX "Class_class_lesson_key";

-- DropIndex
DROP INDEX "Class_classroom_key";

-- DropIndex
DROP INDEX "Class_cram_key";

-- DropIndex
DROP INDEX "Class_teacher_key";

-- DropIndex
DROP INDEX "Course_course_name_key";

-- DropIndex
DROP INDEX "Message_receiver_key";

-- DropIndex
DROP INDEX "Message_sender_key";

-- DropIndex
DROP INDEX "News_title_key";

-- DropIndex
DROP INDEX "Node_author_key";

-- DropIndex
DROP INDEX "Node_language_key";

-- DropIndex
DROP INDEX "Node_name_key";

-- DropIndex
DROP INDEX "Node_node_lesson_key";

-- DropIndex
DROP INDEX "Node_subject_key";

-- DropIndex
DROP INDEX "Node_teacher_key";

-- DropIndex
DROP INDEX "Node_title_key";

-- DropIndex
DROP INDEX "Product_name_key";

-- DropIndex
DROP INDEX "School_id_key";

-- DropIndex
DROP INDEX "School_school_name_key";

-- DropIndex
DROP INDEX "StaffUser_cram_key";

-- DropIndex
DROP INDEX "Student_school_key";

-- DropIndex
DROP INDEX "Student_student_id_key";

-- DropIndex
DROP INDEX "Teacher_time_work_month_key";

-- DropIndex
DROP INDEX "Teacher_upload_node_author_key";

-- DropIndex
DROP INDEX "Teacher_upload_node_name_key";

-- DropIndex
DROP INDEX "Teacher_upload_node_subject_key";

-- DropIndex
DROP INDEX "Teacher_upload_node_teacher_key";

-- DropIndex
DROP INDEX "Teacher_upload_node_title_key";

-- DropIndex
DROP INDEX "student_booklist_name_key";

-- DropIndex
DROP INDEX "student_booklist_student_name_key";

-- DropIndex
DROP INDEX "student_ex_paper_name_key";

-- DropIndex
DROP INDEX "student_ex_paper_student_name_key";

-- DropIndex
DROP INDEX "student_ex_scope_name_key";

-- DropIndex
DROP INDEX "student_ex_scope_student_name_key";

-- DropIndex
DROP INDEX "student_ex_timetable_name_key";

-- DropIndex
DROP INDEX "student_ex_timetable_student_name_key";

-- DropIndex
DROP INDEX "student_score_student_name_key";

-- DropIndex
DROP INDEX "student_score_subject_key";

-- AlterTable
ALTER TABLE "AddClass" DROP COLUMN "classId",
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentclassId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "targetclassId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Apply" ADD COLUMN     "applystate" TEXT NOT NULL,
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "course_name" TEXT NOT NULL,
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdata" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isapply" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nochangeclass" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_id" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booklist" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "classroom",
ADD COLUMN     "allDay" BOOLEAN DEFAULT false,
ADD COLUMN     "attend_name" TEXT[],
ADD COLUMN     "class_subject" TEXT NOT NULL,
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "freq" TEXT,
ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "isSubmittedform" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isshow" BOOLEAN NOT NULL,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "class_date" SET NOT NULL,
ALTER COLUMN "class_date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "course_level",
ADD COLUMN     "TimeTemplateID" TEXT NOT NULL,
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "day_end" TEXT NOT NULL,
ADD COLUMN     "day_start" TEXT NOT NULL,
ADD COLUMN     "days" JSONB NOT NULL,
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "isshow" BOOLEAN NOT NULL,
ADD COLUMN     "publicholiday_model" TEXT[],
ADD COLUMN     "start_time" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weekdays" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Ex_pager" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ex_scope" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ex_timetable" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "teacher",
ADD COLUMN     "teacher" TEXT[];

-- AlterTable
ALTER TABLE "Price_record" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "Course_id" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "School_timetable" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StaffUser" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "final_day",
DROP COLUMN "student_class_id",
ADD COLUMN     "chine_ex" TEXT,
ADD COLUMN     "chine_ex_day" TEXT,
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eng_ex" TEXT,
ADD COLUMN     "eng_ex_day" TEXT,
ADD COLUMN     "ismember" BOOLEAN NOT NULL,
ADD COLUMN     "issurvive" BOOLEAN NOT NULL,
ADD COLUMN     "math_ex" TEXT,
ADD COLUMN     "math_ex_day" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "student_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher_time_work" ADD COLUMN     "class_time_work_id" TEXT NOT NULL,
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "year" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher_upload_node" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ISNEW" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_booklist" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_ex_paper" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_ex_scope" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_ex_timetable" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_school_timetable" DROP COLUMN "subject",
ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_score" ADD COLUMN     "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AttendRollCall";

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "room" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethods_price" (
    "id" TEXT NOT NULL,
    "Invoice_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "Item_name" TEXT[],
    "PaymentMethods" TEXT NOT NULL,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethods_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voidRecord" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voidRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT[],
    "studentname" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "Invoice_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "servetype" TEXT NOT NULL,
    "PaymentMethods" TEXT[],
    "DB" DOUBLE PRECISION NOT NULL,
    "adminFee" DOUBLE PRECISION NOT NULL,
    "isPayment" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT[],
    "studentname" TEXT NOT NULL,
    "invoicebydbid" TEXT NOT NULL,
    "Invoice_id" TEXT NOT NULL,
    "servetype" TEXT NOT NULL,
    "isPayment" BOOLEAN NOT NULL,
    "DB" DOUBLE PRECISION NOT NULL,
    "adminFee" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "PaymentMethods" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinStudent" (
    "id" TEXT NOT NULL,
    "courseid" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "targetcourseId" TEXT NOT NULL,

    CONSTRAINT "JoinStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" TEXT NOT NULL,
    "targetclassId" TEXT NOT NULL,
    "currentclassId" TEXT NOT NULL,
    "name" TEXT[],
    "date" TEXT NOT NULL,
    "class_date" TEXT NOT NULL,
    "createData" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeClass" (
    "id" TEXT NOT NULL,
    "targetclassId" TEXT NOT NULL,
    "currentclassId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "class_date" TEXT NOT NULL,
    "createData" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChangeClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttenDance" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttenDance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School_EX_Day" (
    "id" TEXT NOT NULL,
    "school_ex_day_id" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "EX_Day" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_EX_Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School_Subject" (
    "id" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "chine_data" TEXT NOT NULL,
    "math_data" TEXT NOT NULL,
    "eng_data" TEXT NOT NULL,
    "school_subject_id" TEXT NOT NULL,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_holiday" (
    "id" TEXT NOT NULL,
    "publicholiday" TEXT[],
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetemplate" (
    "id" TEXT NOT NULL,
    "publicholiday_model" TEXT[],
    "title" TEXT NOT NULL,
    "day_start" TEXT NOT NULL,
    "day_end" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "weekdays" JSONB NOT NULL,
    "days" JSONB NOT NULL,
    "lesson" TEXT NOT NULL,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dailyreviews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "craetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dailyreviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassroomToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InvoiceToStaffUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InvoiceToPaymentMethods_price" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ReceiptToStaffUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassToClassroom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "School_Subject_id_key" ON "School_Subject"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassroomToCourse_AB_unique" ON "_ClassroomToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassroomToCourse_B_index" ON "_ClassroomToCourse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InvoiceToStaffUser_AB_unique" ON "_InvoiceToStaffUser"("A", "B");

-- CreateIndex
CREATE INDEX "_InvoiceToStaffUser_B_index" ON "_InvoiceToStaffUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InvoiceToPaymentMethods_price_AB_unique" ON "_InvoiceToPaymentMethods_price"("A", "B");

-- CreateIndex
CREATE INDEX "_InvoiceToPaymentMethods_price_B_index" ON "_InvoiceToPaymentMethods_price"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ReceiptToStaffUser_AB_unique" ON "_ReceiptToStaffUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ReceiptToStaffUser_B_index" ON "_ReceiptToStaffUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToClassroom_AB_unique" ON "_ClassToClassroom"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToClassroom_B_index" ON "_ClassToClassroom"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToStudent_AB_unique" ON "_ClassToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToStudent_B_index" ON "_ClassToStudent"("B");

-- AddForeignKey
ALTER TABLE "JoinStudent" ADD CONSTRAINT "JoinStudent_targetcourseId_fkey" FOREIGN KEY ("targetcourseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinStudent" ADD CONSTRAINT "JoinStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_TimeTemplateID_fkey" FOREIGN KEY ("TimeTemplateID") REFERENCES "timetemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_targetclassId_fkey" FOREIGN KEY ("targetclassId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeClass" ADD CONSTRAINT "ChangeClass_targetclassId_fkey" FOREIGN KEY ("targetclassId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttenDance" ADD CONSTRAINT "AttenDance_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttenDance" ADD CONSTRAINT "AttenDance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddClass" ADD CONSTRAINT "AddClass_targetclassId_fkey" FOREIGN KEY ("targetclassId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher_time_work" ADD CONSTRAINT "Teacher_time_work_class_time_work_id_fkey" FOREIGN KEY ("class_time_work_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School_EX_Day" ADD CONSTRAINT "School_EX_Day_school_ex_day_id_fkey" FOREIGN KEY ("school_ex_day_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School_Subject" ADD CONSTRAINT "School_Subject_school_subject_id_fkey" FOREIGN KEY ("school_subject_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dailyreviews" ADD CONSTRAINT "dailyreviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dailyreviews" ADD CONSTRAINT "dailyreviews_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "StaffUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToCourse" ADD CONSTRAINT "_ClassroomToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToCourse" ADD CONSTRAINT "_ClassroomToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvoiceToStaffUser" ADD CONSTRAINT "_InvoiceToStaffUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvoiceToStaffUser" ADD CONSTRAINT "_InvoiceToStaffUser_B_fkey" FOREIGN KEY ("B") REFERENCES "StaffUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvoiceToPaymentMethods_price" ADD CONSTRAINT "_InvoiceToPaymentMethods_price_A_fkey" FOREIGN KEY ("A") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvoiceToPaymentMethods_price" ADD CONSTRAINT "_InvoiceToPaymentMethods_price_B_fkey" FOREIGN KEY ("B") REFERENCES "PaymentMethods_price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReceiptToStaffUser" ADD CONSTRAINT "_ReceiptToStaffUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReceiptToStaffUser" ADD CONSTRAINT "_ReceiptToStaffUser_B_fkey" FOREIGN KEY ("B") REFERENCES "StaffUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToClassroom" ADD CONSTRAINT "_ClassToClassroom_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToClassroom" ADD CONSTRAINT "_ClassToClassroom_B_fkey" FOREIGN KEY ("B") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudent" ADD CONSTRAINT "_ClassToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudent" ADD CONSTRAINT "_ClassToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
