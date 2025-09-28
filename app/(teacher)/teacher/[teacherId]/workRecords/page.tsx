"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logout_Button } from "@/components/logout_button";
import TeacherNavbar from "../_components/navbar";

// 定義型別
interface Class {
  id: string;
  title: string;
  class_date: string;
  attend_number: number;
  class_time_h: number;
}

interface Course {
  id: string;
  course_name: string;
  course_subject: string;
  grade: number;
  class: Class[];
  weekdays: string[];
}

interface TeacherTimeWork {
  id: string;
  year: string;
  month: string;
  HS_HR: number;
  HS_number: number;
  JHS_HR: number;
  JHS_number: number;
  P_HR: number;
  P_number: number;
}

interface TeacherData {
  id: string;
  username: string;
  Course: Course[];
  teacher_time_work: TeacherTimeWork[];
}

interface ClassRecord {
  year: number;
  month: number;
  day: number;
  courseName: string;
  subject: string;
  grade: number;
  attendNumber: number;
  className: string;
  teachingHours: number;
  date: string;
}

interface WorkRecord {
  year: string;
  month: string;
  day: number;
  courseName: string;
  subject: string;
  grade: number;
  hsNumber: number;
  jhsNumber: number;
  pNumber: number;
  hsHours: number;
  jhsHours: number;
  pHours: number;
  className: string;
}

const WorkRecords = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ teacherId: string }>();
  const teacherId = params?.teacherId as string;

  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [sortField, setSortField] = useState<keyof ClassRecord | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [workSortField, setWorkSortField] = useState<keyof WorkRecord | null>(null);
  const [workSortOrder, setWorkSortOrder] = useState<"asc" | "desc">("asc");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 身份驗證檢查
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    } else if (session?.user.id !== teacherId || session?.user.role !== "TEACHER") {
      setError("無權訪問此頁面");
      router.push("/auth/error?error=AccessDenied");
    }
  }, [status, session, teacherId, router]);

  // 獲取教師數據
  useEffect(() => {
    if (teacherId && status === "authenticated" && !error) {
      const fetchTeacherData = async (id: string) => {
        try {
          const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) throw new Error("無法獲取教師數據");
          const result: TeacherData[] = await res.json();
          setTeacherData(result);
          console.log("Fetched teacherData:", result);
        } catch (error: any) {
          console.error("獲取教師數據失敗:", error.message);
          setError("無法載入教師數據，請稍後重試");
        }
      };
      fetchTeacherData(teacherId);
    }
  }, [teacherId, status, error]);

  // 將所有 class 展平並添加必要資訊（原有表格）
  const getAllClasses = (): ClassRecord[] => {
    if (!teacherData[0]?.Course) {
      console.log("No courses found in teacherData");
      return [];
    }

    const classes = teacherData[0].Course.flatMap((course) => {
      console.log(`Course: ${course.course_name}, Class count: ${course.class.length}`);
      const source = course.class.length > 0 ? course.class : course.weekdays.map((date) => ({
        id: "",
        title: "未命名",
        class_date: date,
        attend_number: 0,
        class_time_h: 0,
      }));
      return source.map((cls) => {
        let year, month, day;
        try {
          const date = new Date(cls.class_date);
          if (isNaN(date.getTime())) throw new Error("Invalid date");
          year = date.getFullYear();
          month = date.getMonth() + 1;
          day = date.getDate();
        } catch (error) {
          console.log(`Invalid class_date for ${course.course_name}: ${cls.class_date}`);
          return null;
        }
        return {
          year,
          month,
          day,
          courseName: course.course_name,
          subject: course.course_subject,
          grade: course.grade,
          attendNumber: cls.attend_number,
          className: cls.title,
          teachingHours: cls.attend_number > 0 ? cls.class_time_h : 0, // 根據 attend_number 決定 teachingHours
          date: cls.class_date,
        };
      }).filter((cls): cls is ClassRecord => cls !== null);
    });

    console.log("Generated classes:", classes);
    return classes;
  };

  // 新表格數據：結合 teacher_time_work 和 courses.class 或 weekdays
  const getWorkRecords = (): WorkRecord[] => {
    if (!teacherData[0]?.teacher_time_work || !teacherData[0]?.Course) {
      console.log("No teacher_time_work or courses found in teacherData");
      return [];
    }

    const timeWork = teacherData[0].teacher_time_work[0];
    console.log("timeWork:", timeWork);

    const workRecords = teacherData[0].Course.flatMap((course) => {
      console.log(`Processing course: ${course.course_name}, Class count: ${course.class.length}`);
      const source = course.class.length > 0 ? course.class : course.weekdays.map((date) => ({
        id: "",
        title: "未命名",
        class_date: date,
        attend_number: 0,
        class_time_h: 0,
      }));
      return source
        .filter((cls) => {
          let classYear, classMonth;
          try {
            const date = new Date(cls.class_date);
            if (isNaN(date.getTime())) throw new Error("Invalid date");
            classYear = date.getFullYear().toString();
            classMonth = (date.getMonth() + 1).toString();
          } catch (error) {
            console.log(`Invalid class_date for ${course.course_name}: ${cls.class_date}`);
            return false;
          }
          const match = classYear === timeWork.year && classMonth === timeWork.month;
          console.log(
            `Class date: ${cls.class_date}, Year: ${classYear}, Month: ${classMonth}, Matches: ${match}`
          );
          return match;
        })
        .map((cls) => {
          // 根據 grade 映射到 HS/JHS/P，並根據 attend_number 決定教授時間
          let hsNumber = 0, jhsNumber = 0, pNumber = 0;
          let hsHours = 0, jhsHours = 0, pHours = 0;
          const gradeNum = course.grade;
          if (cls.attend_number > 0) {
            if (gradeNum >= 10) { // 高中
              hsNumber = cls.attend_number;
              hsHours = cls.class_time_h;
            } else if (gradeNum >= 7) { // 初中
              jhsNumber = cls.attend_number;
              jhsHours = cls.class_time_h;
            } else { // 小學
              pNumber = cls.attend_number;
              pHours = cls.class_time_h;
            }
          }

          return {
            year: timeWork.year,
            month: timeWork.month,
            day: new Date(cls.class_date).getDate(),
            courseName: course.course_name,
            subject: course.course_subject,
            grade: course.grade,
            hsNumber,
            jhsNumber,
            pNumber,
            hsHours,
            jhsHours,
            pHours,
            className: cls.title,
          };
        });
    });

    console.log("Generated workRecords:", workRecords);
    return workRecords;
  };

  // 排序功能（原有表格）
  const handleSort = (field: keyof ClassRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // 排序功能（新表格）
  const handleWorkSort = (field: keyof WorkRecord) => {
    if (workSortField === field) {
      setWorkSortOrder(workSortOrder === "asc" ? "desc" : "asc");
    } else {
      setWorkSortField(field);
      setWorkSortOrder("asc");
    }
  };

  // 篩選和排序後的課程數據（原有表格）
  const getFilteredAndSortedClasses = (): ClassRecord[] => {
    let classes = getAllClasses();

    console.log(`Before filtering - Classes count: ${classes.length}`);
    if (filterYear) {
      console.log(`Filtering by year: ${filterYear}`);
      classes = classes.filter((cls) => cls.year === parseInt(filterYear));
    }
    if (filterMonth) {
      console.log(`Filtering by month: ${filterMonth}`);
      classes = classes.filter((cls) => cls.month === parseInt(filterMonth));
    }
    console.log(`After filtering - Classes count: ${classes.length}`);

    if (sortField) {
      console.log(`Sorting by field: ${sortField}, order: ${sortOrder}`);
      classes.sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];
        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    return classes;
  };

  // 排序後的工作記錄（新表格，僅排序，不篩選）
  const getSortedWorkRecords = (): WorkRecord[] => {
    let records = getWorkRecords();

    console.log(`WorkRecords count: ${records.length}`);
    if (workSortField) {
      console.log(`Sorting by field: ${workSortField}, order: ${workSortOrder}`);
      records.sort((a, b) => {
        const valueA = a[workSortField];
        const valueB = b[workSortField];
        if (workSortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    return records;
  };

  // 計算總計（原有表格）
  const calculateTotals = () => {
    const classes = getFilteredAndSortedClasses();
    return {
      totalAttendance: classes.reduce((sum, cls) => sum + cls.attendNumber, 0),
      totalHours: classes.reduce((sum, cls) => sum + cls.teachingHours, 0),
    };
  };

  // 計算新表格總計
  const calculateWorkRecordTotals = () => {
    const workRecords = getSortedWorkRecords();
    if (workRecords.length === 0) {
      return { totalAttendance: 0, totalHours: 0 };
    }

    // 總和 per-class 值
    const totalAttendance = workRecords.reduce(
      (sum, record) => sum + (record.hsNumber + record.jhsNumber + record.pNumber),
      0
    );
    const totalHours = workRecords.reduce(
      (sum, record) => sum + (record.hsHours + record.jhsHours + record.pHours),
      0
    );

    return { totalAttendance, totalHours };
  };

  const classes = getFilteredAndSortedClasses();
  const workRecords = getSortedWorkRecords();
  const totals = calculateTotals();
  const workRecordTotals = calculateWorkRecordTotals();

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <span>Work Records</span>
        <br />
        {error}
      </div>
    );
  }

  console.log("teacherData:", teacherData, "-- End --");
  console.log("teacherData的Course[]:", teacherData[0]?.Course, "-- End --");
  console.log("workRecords:", workRecords, "-- End --");
  console.log("classes:", classes, "-- End --");

  return (
    <div className="container mx-auto h-full w-full bg-blue-200 p-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-6">
        <div className="col-span-6 flex justify-between items-center">
          <p className="text-gray-500 text-lg">Work Records</p>
          <div className="flex space-x-2">
            <Logout_Button />
          </div>
        </div>

        <TeacherNavbar teacherId={teacherId} />

        {/* 篩選區域 */}
        <div className="col-span-6 flex gap-4">
          <input
            type="number"
            placeholder="年份"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">選擇月份</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}月
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setFilterYear(filterYear);
              setFilterMonth(filterMonth);
            }}
            className="bg-blue-400 text-white px-4 py-2 rounded"
          >
            確定
          </button>
        </div>

        {/* 原有表格：課程記錄 */}
        <div className="col-span-5 mt-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">課程記錄</h2>
          <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                {[
                  { label: "年份", field: "year" },
                  { label: "月份", field: "month" },
                  { label: "日期", field: "day" },
                  { label: "課程", field: "courseName" },
                  { label: "科目", field: "subject" },
                  { label: "年級", field: "grade" },
                  { label: "出席人數", field: "attendNumber" },
                  { label: "課程名稱", field: "className" },
                  { label: "教授時間", field: "teachingHours" },
                ].map((header) => (
                  <th
                    key={header.field}
                    onClick={() => handleSort(header.field as keyof ClassRecord)}
                    className="p-2 border cursor-pointer hover:bg-gray-300"
                  >
                    {header.label}
                    {sortField === header.field && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.length > 0 ? (
                classes.map((cls, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{cls.year}</td>
                    <td className="p-2">{cls.month}</td>
                    <td className="p-2">{cls.day}</td>
                    <td className="p-2">{cls.courseName}</td>
                    <td className="p-2">{cls.subject}</td>
                    <td className="p-2">{cls.grade}</td>
                    <td className="p-2">{cls.attendNumber}</td>
                    <td className="p-2">{cls.className || "未命名"}</td>
                    <td className="p-2">{cls.teachingHours}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-2 text-center">暫無課程數據</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 原有表格總計 */}
          <div className="mt-4 text-right">
            <p>總出席人數: {totals.totalAttendance}</p>
            <p>總教授時間: {totals.totalHours} 小時</p>
          </div>
        </div>

        {/* 新表格：工作記錄 */}
        <div className="col-span-5 mt-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">工作記錄</h2>
          <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                {[
                  { label: "年份", field: "year" },
                  { label: "月份", field: "month" },
                  { label: "日期", field: "day" },
                  { label: "課程", field: "courseName" },
                  { label: "科目", field: "subject" },
                  { label: "年級", field: "grade" },
                  { label: "高中出席人數", field: "hsNumber" },
                  { label: "初中出席人數", field: "jhsNumber" },
                  { label: "小學出席人數", field: "pNumber" },
                  { label: "高中教授時間", field: "hsHours" },
                  { label: "初中教授時間", field: "jhsHours" },
                  { label: "小學教授時間", field: "pHours" },
                  { label: "課程名稱", field: "className" },
                ].map((header) => (
                  <th
                    key={header.field}
                    onClick={() => handleWorkSort(header.field as keyof WorkRecord)}
                    className="p-2 border cursor-pointer hover:bg-gray-300"
                  >
                    {header.label}
                    {workSortField === header.field && (workSortOrder === "asc" ? " ↑" : " ↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workRecords.length > 0 ? (
                workRecords.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{record.year}</td>
                    <td className="p-2">{record.month}</td>
                    <td className="p-2">{record.day}</td>
                    <td className="p-2">{record.courseName}</td>
                    <td className="p-2">{record.subject}</td>
                    <td className="p-2">{record.grade}</td>
                    <td className="p-2">{record.hsNumber}</td>
                    <td className="p-2">{record.jhsNumber}</td>
                    <td className="p-2">{record.pNumber}</td>
                    <td className="p-2">{record.hsHours}</td>
                    <td className="p-2">{record.jhsHours}</td>
                    <td className="p-2">{record.pHours}</td>
                    <td className="p-2">{record.className || "未命名"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={13} className="p-2 text-center">暫無工作記錄</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 新表格總計 */}
          <div className="mt-4 text-right">
            <p>總出席人數: {workRecordTotals.totalAttendance}</p>
            <p>總教授時間: {workRecordTotals.totalHours} 小時</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkRecords;