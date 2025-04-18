-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPADMIN', 'TEACHER', 'PARENT', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin_data" (
    "id" TEXT NOT NULL,
    "cram" TEXT NOT NULL,
    "admin_user_id" TEXT NOT NULL,

    CONSTRAINT "Admin_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent_data" (
    "id" TEXT NOT NULL,
    "parent_user_id" TEXT NOT NULL,
    "parent_message_id" TEXT NOT NULL,
    "parent_price_record_id" TEXT NOT NULL,

    CONSTRAINT "Parent_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price_record" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "parent_name" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Price_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "product_price_record_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "message_content" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "sender" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "final_day" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "teachers" TEXT NOT NULL,
    "pay" BOOLEAN NOT NULL,
    "student_parent_data_id" TEXT NOT NULL,
    "student_class_id" TEXT NOT NULL,
    "student_teacher_data_id" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apply" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "apply" BOOLEAN NOT NULL,
    "apply_student_id" TEXT NOT NULL,

    CONSTRAINT "Apply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_subject" TEXT NOT NULL,
    "persons" INTEGER NOT NULL,
    "course_level" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "course_teacher_data_id" TEXT[],
    "grade" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "class_time_h" INTEGER NOT NULL,
    "cram" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "class_course_id" TEXT NOT NULL,
    "class_lesson" TEXT NOT NULL,
    "class_start_time" TEXT NOT NULL,
    "class_end_time" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "node" INTEGER NOT NULL,
    "attend_number" INTEGER NOT NULL,
    "class_date" TIMESTAMP(3)[],
    "persons" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendRollCall" (
    "id" TEXT NOT NULL,
    "attend" TEXT NOT NULL,
    "attendRollCall_class_id" TEXT NOT NULL,

    CONSTRAINT "AttendRollCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "img" TEXT,
    "answer" BOOLEAN NOT NULL,
    "node_lesson" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddClass" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "AddClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher_data" (
    "id" TEXT NOT NULL,
    "subject" TEXT[],
    "cram" TEXT NOT NULL,
    "teacher_time_work_id" TEXT NOT NULL,
    "teacher_upload_node_id" TEXT NOT NULL,
    "teacher_user_id" TEXT NOT NULL,
    "teacher_node_id" TEXT NOT NULL,

    CONSTRAINT "Teacher_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher_time_work" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "P_HR" INTEGER NOT NULL,
    "JHS_HR" INTEGER NOT NULL,
    "HS_HR" INTEGER NOT NULL,
    "P_number" INTEGER NOT NULL,
    "JHS_number" INTEGER NOT NULL,
    "HS_number" INTEGER NOT NULL,
    "teacher_time_work_id" TEXT NOT NULL,

    CONSTRAINT "Teacher_time_work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher_upload_node" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "img" TEXT,
    "lesson" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "teacher_data_id" TEXT NOT NULL,

    CONSTRAINT "Teacher_upload_node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School_timetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "school_school_timetable_id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "School_timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ex_pager" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "school_ex_pager_id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,

    CONSTRAINT "Ex_pager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ex_scope" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "school_ex_scope_id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Ex_scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ex_timetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "school_ex_time_id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Ex_timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booklist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "school_booklist_id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "Booklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "school_score_id" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "school_name" TEXT NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_school_timetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "student_school_timetable_id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "school" TEXT NOT NULL,

    CONSTRAINT "student_school_timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_ex_paper" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "student_ex_paper_id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "school" TEXT NOT NULL,

    CONSTRAINT "student_ex_paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_ex_scope" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "student_ex_scope_id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "school" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "student_ex_scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_ex_timetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "student_ex_timetable_id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "school" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "student_ex_timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_booklist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "student_booklist_id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "school" TEXT NOT NULL,

    CONSTRAINT "student_booklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_score" (
    "id" TEXT NOT NULL,
    "student_score_id" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "student_name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "school" TEXT NOT NULL,

    CONSTRAINT "student_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToTeacher_data" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherNode" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_data_cram_key" ON "Admin_data"("cram");

-- CreateIndex
CREATE UNIQUE INDEX "Price_record_parent_name_key" ON "Price_record"("parent_name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Message_receiver_key" ON "Message"("receiver");

-- CreateIndex
CREATE UNIQUE INDEX "Message_sender_key" ON "Message"("sender");

-- CreateIndex
CREATE UNIQUE INDEX "Student_name_key" ON "Student"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_school_key" ON "Student"("school");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_id_key" ON "Student"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_author_key" ON "Comment"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_student_id_key" ON "Comment"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Apply_title_key" ON "Apply"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Apply_apply_student_id_key" ON "Apply"("apply_student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_course_name_key" ON "Course"("course_name");

-- CreateIndex
CREATE UNIQUE INDEX "Class_cram_key" ON "Class"("cram");

-- CreateIndex
CREATE UNIQUE INDEX "Class_classroom_key" ON "Class"("classroom");

-- CreateIndex
CREATE UNIQUE INDEX "Class_class_course_id_key" ON "Class"("class_course_id");

-- CreateIndex
CREATE UNIQUE INDEX "Class_class_lesson_key" ON "Class"("class_lesson");

-- CreateIndex
CREATE UNIQUE INDEX "Class_teacher_key" ON "Class"("teacher");

-- CreateIndex
CREATE UNIQUE INDEX "AttendRollCall_attendRollCall_class_id_key" ON "AttendRollCall"("attendRollCall_class_id");

-- CreateIndex
CREATE UNIQUE INDEX "Node_name_key" ON "Node"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Node_title_key" ON "Node"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Node_author_key" ON "Node"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Node_node_lesson_key" ON "Node"("node_lesson");

-- CreateIndex
CREATE UNIQUE INDEX "Node_language_key" ON "Node"("language");

-- CreateIndex
CREATE UNIQUE INDEX "Node_teacher_key" ON "Node"("teacher");

-- CreateIndex
CREATE UNIQUE INDEX "Node_subject_key" ON "Node"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "AddClass_studentId_key" ON "AddClass"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_data_cram_key" ON "Teacher_data"("cram");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_time_work_month_key" ON "Teacher_time_work"("month");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_upload_node_name_key" ON "Teacher_upload_node"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_upload_node_author_key" ON "Teacher_upload_node"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_upload_node_teacher_key" ON "Teacher_upload_node"("teacher");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_upload_node_subject_key" ON "Teacher_upload_node"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_upload_node_title_key" ON "Teacher_upload_node"("title");

-- CreateIndex
CREATE UNIQUE INDEX "News_title_key" ON "News"("title");

-- CreateIndex
CREATE UNIQUE INDEX "School_id_key" ON "School"("id");

-- CreateIndex
CREATE UNIQUE INDEX "School_school_name_key" ON "School"("school_name");

-- CreateIndex
CREATE UNIQUE INDEX "Booklist_name_key" ON "Booklist"("name");

-- CreateIndex
CREATE INDEX "Booklist_school_booklist_id_grade_year_idx" ON "Booklist"("school_booklist_id", "grade", "year");

-- CreateIndex
CREATE UNIQUE INDEX "student_ex_paper_name_key" ON "student_ex_paper"("name");

-- CreateIndex
CREATE UNIQUE INDEX "student_ex_paper_student_name_key" ON "student_ex_paper"("student_name");

-- CreateIndex
CREATE UNIQUE INDEX "student_ex_scope_name_key" ON "student_ex_scope"("name");

-- CreateIndex
CREATE UNIQUE INDEX "student_ex_scope_student_name_key" ON "student_ex_scope"("student_name");

-- CreateIndex
CREATE UNIQUE INDEX "student_ex_timetable_name_key" ON "student_ex_timetable"("name");

-- CreateIndex
CREATE UNIQUE INDEX "student_ex_timetable_student_name_key" ON "student_ex_timetable"("student_name");

-- CreateIndex
CREATE UNIQUE INDEX "student_booklist_name_key" ON "student_booklist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "student_booklist_student_name_key" ON "student_booklist"("student_name");

-- CreateIndex
CREATE UNIQUE INDEX "student_score_subject_key" ON "student_score"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "student_score_student_name_key" ON "student_score"("student_name");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToTeacher_data_AB_unique" ON "_CourseToTeacher_data"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToTeacher_data_B_index" ON "_CourseToTeacher_data"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToStudent_AB_unique" ON "_CourseToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToStudent_B_index" ON "_CourseToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherNode_AB_unique" ON "_TeacherNode"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherNode_B_index" ON "_TeacherNode"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin_data" ADD CONSTRAINT "Admin_data_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent_data" ADD CONSTRAINT "Parent_data_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent_data" ADD CONSTRAINT "Parent_data_parent_price_record_id_fkey" FOREIGN KEY ("parent_price_record_id") REFERENCES "Price_record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent_data" ADD CONSTRAINT "Parent_data_parent_user_id_fkey" FOREIGN KEY ("parent_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price_record" ADD CONSTRAINT "Price_record_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_student_class_id_fkey" FOREIGN KEY ("student_class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_student_parent_data_id_fkey" FOREIGN KEY ("student_parent_data_id") REFERENCES "Parent_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_student_teacher_data_id_fkey" FOREIGN KEY ("student_teacher_data_id") REFERENCES "Teacher_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apply" ADD CONSTRAINT "Apply_apply_student_id_fkey" FOREIGN KEY ("apply_student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_class_course_id_fkey" FOREIGN KEY ("class_course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendRollCall" ADD CONSTRAINT "AttendRollCall_attendRollCall_class_id_fkey" FOREIGN KEY ("attendRollCall_class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddClass" ADD CONSTRAINT "AddClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddClass" ADD CONSTRAINT "AddClass_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher_data" ADD CONSTRAINT "Teacher_data_teacher_user_id_fkey" FOREIGN KEY ("teacher_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher_time_work" ADD CONSTRAINT "Teacher_time_work_teacher_time_work_id_fkey" FOREIGN KEY ("teacher_time_work_id") REFERENCES "Teacher_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher_upload_node" ADD CONSTRAINT "Teacher_upload_node_teacher_data_id_fkey" FOREIGN KEY ("teacher_data_id") REFERENCES "Teacher_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School_timetable" ADD CONSTRAINT "School_timetable_school_school_timetable_id_fkey" FOREIGN KEY ("school_school_timetable_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ex_pager" ADD CONSTRAINT "Ex_pager_school_ex_pager_id_fkey" FOREIGN KEY ("school_ex_pager_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ex_scope" ADD CONSTRAINT "Ex_scope_school_ex_scope_id_fkey" FOREIGN KEY ("school_ex_scope_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ex_timetable" ADD CONSTRAINT "Ex_timetable_school_ex_time_id_fkey" FOREIGN KEY ("school_ex_time_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booklist" ADD CONSTRAINT "Booklist_school_booklist_id_fkey" FOREIGN KEY ("school_booklist_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_school_score_id_fkey" FOREIGN KEY ("school_score_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_school_timetable" ADD CONSTRAINT "student_school_timetable_student_school_timetable_id_fkey" FOREIGN KEY ("student_school_timetable_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_ex_paper" ADD CONSTRAINT "student_ex_paper_student_ex_paper_id_fkey" FOREIGN KEY ("student_ex_paper_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_ex_scope" ADD CONSTRAINT "student_ex_scope_student_ex_scope_id_fkey" FOREIGN KEY ("student_ex_scope_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_ex_timetable" ADD CONSTRAINT "student_ex_timetable_student_ex_timetable_id_fkey" FOREIGN KEY ("student_ex_timetable_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_booklist" ADD CONSTRAINT "student_booklist_student_booklist_id_fkey" FOREIGN KEY ("student_booklist_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_student_score_id_fkey" FOREIGN KEY ("student_score_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToTeacher_data" ADD CONSTRAINT "_CourseToTeacher_data_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToTeacher_data" ADD CONSTRAINT "_CourseToTeacher_data_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherNode" ADD CONSTRAINT "_TeacherNode_A_fkey" FOREIGN KEY ("A") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherNode" ADD CONSTRAINT "_TeacherNode_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
