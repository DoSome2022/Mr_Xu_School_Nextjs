"use client";

import { useEffect, useState } from "react";

// 定義型別
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
  class_time_work_id: string;
  craetedAt: string;
  updatedAt: string;
  teacher_time_work_id: string;
}

interface TeacherData {
  id: string;
  username: string;
  role: string;
  teacher_time_work: TeacherTimeWork[];
}

const TeacherBills = () => {
  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTeacherId, setExpandedTeacherId] = useState<string | null>(null); // 追蹤展開的教師 ID
  const [filterYear, setFilterYear] = useState(""); // 年份篩選
  const [filterMonth, setFilterMonth] = useState(""); // 月份篩選

  // 獲取教師數據
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/Course_data_teacher", {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法連接到伺服器");
        }
        const result = await res.json();
        setTeacherData(result);
      } catch (error) {
        console.error("獲取老師數據失敗:", error);
        setError("無法載入老師數據，請稍後再試");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  // 篩選 role 為 TEACHER 的教師
  const teachers = teacherData.filter((teacher) => teacher.role === "TEACHER");

  // 處理展開/收起
  const handleToggle = (teacherId: string) => {
    setExpandedTeacherId(expandedTeacherId === teacherId ? null : teacherId);
  };

  // 應用篩選到 teacher_time_work
  const getFilteredTeacherTimeWork = (teacherTimeWork: TeacherTimeWork[]) => {
    return teacherTimeWork.filter((work) => {
      const matchYear = !filterYear || work.year === filterYear;
      const matchMonth = !filterMonth || work.month === filterMonth;
      return matchYear && matchMonth;
    });
  };

  // 清除篩選
  const handleClearFilter = () => {
    setFilterYear("");
    setFilterMonth("");
  };

  // 日誌
  console.log("teacherData:", teacherData, "-- End --");

  if (isLoading) {
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
        <span>Teacher Bills</span>
        <br />
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Teacher Bills</h1>

      {/* 篩選區域 */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
            <input
              type="number"
              placeholder="輸入年份 (e.g., 2025)"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">月份</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選擇月份</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1)}>
                  {i + 1}月
                </option>
              ))}
            </select>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleClearFilter}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              清除
            </button>
            <button
              onClick={() => {
                // 無需 forceUpdate，狀態更新會自動觸發重新渲染
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              篩選
            </button>
          </div>
        </div>
      </div>

      {teachers.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg">
          {teachers.map((teacher) => {
            const filteredTimeWork = getFilteredTeacherTimeWork(teacher.teacher_time_work);
            return (
              <div key={teacher.id} className="border-b last:border-b-0">
                {/* 教師 username，點擊展開/收起 */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                  onClick={() => handleToggle(teacher.id)}
                >
                  <span className="text-lg font-semibold">{teacher.username}</span>
                  <span className="text-sm text-gray-500">
                    ({filteredTimeWork.length} 筆記錄)
                  </span>
                </div>
                {/* 展開時顯示 teacher_time_work */}
                {expandedTeacherId === teacher.id && (
                  <div className="p-4">
                    {filteredTimeWork.length > 0 ? (
                      <table className="table-auto w-full border-collapse bg-white">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 border">年份</th>
                            <th className="p-2 border">月份</th>
                            <th className="p-2 border">高中教授時間</th>
                            <th className="p-2 border">高中出席人數</th>
                            <th className="p-2 border">初中教授時間</th>
                            <th className="p-2 border">初中出席人數</th>
                            <th className="p-2 border">小學教授時間</th>
                            <th className="p-2 border">小學出席人數</th>
                            <th className="p-2 border">建立時間</th>
                            <th className="p-2 border">更新時間</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTimeWork.map((work, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2">{work.year}</td>
                              <td className="p-2">{work.month}</td>
                              <td className="p-2">{work.HS_HR}</td>
                              <td className="p-2">{work.HS_number}</td>
                              <td className="p-2">{work.JHS_HR}</td>
                              <td className="p-2">{work.JHS_number}</td>
                              <td className="p-2">{work.P_HR}</td>
                              <td className="p-2">{work.P_number}</td>
                              <td className="p-2">{new Date(work.craetedAt).toLocaleString()}</td>
                              <td className="p-2">{new Date(work.updatedAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500">無匹配的工作記錄</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">無教師數據</p>
      )}
    </div>
  );
};

export default TeacherBills;