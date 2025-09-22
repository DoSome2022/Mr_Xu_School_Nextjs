"use client";

import StudentExDay_Udate_Form from "@/components/UpdateForm/StudentExDay-Update-Form";
import { useParams } from "next/navigation";

const CreateStudentExDayPage = () => {
  return (
    <div>
      <h1>CreateStudentExDayPage</h1>
      <StudentExDay_Udate_Form />
    </div>
  );
};

export default CreateStudentExDayPage;