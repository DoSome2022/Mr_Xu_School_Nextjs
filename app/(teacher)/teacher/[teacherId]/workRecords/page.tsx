"use client";

import { Logout_Button } from "@/components/logout_button";
import TeacherNavber from "../_components/navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const WorkRecords = () => {
  const param = useParams();
  const teacherId = param?.teacherId as string;

  const [teacherData, setTeacherData] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const fetchTeacherData = async (id: string) => {
      const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch teacher data");
      }
      const result = await res.json();
      setTeacherData(result);
    };
    fetchTeacherData(teacherId);
  }, [teacherId]);

  // 將所有class展平並添加必要資訊
  const getAllClasses = () => {
    if (!teacherData[0]?.Course) return [];
    
    return teacherData[0].Course.flatMap(course => 
      course.class.map(cls => ({
        year: new Date(cls.class_date).getFullYear(),
        month: new Date(cls.class_date).getMonth() + 1,
        day: new Date(cls.class_date).getDate(),
        courseName: course.course_name,
        subject: course.course_subject,
        grade: course.grade,
        attendNumber: cls.attend_number,
        className: cls.title,
        teachingHours: cls.class_time_h,
        date: cls.class_date
      }))
    );
  };

  // 排序功能
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 篩選和排序後的課程數據
  const getFilteredAndSortedClasses = () => {
    let classes = getAllClasses();

    // 應用年份和月份篩選
    if (filterYear) {
      classes = classes.filter(cls => cls.year === parseInt(filterYear));
    }
    if (filterMonth) {
      classes = classes.filter(cls => cls.month === parseInt(filterMonth));
    }

    // 應用排序
    if (sortField) {
      classes.sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];
        if (sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    return classes;
  };

  // 計算總計
  const calculateTotals = () => {
    const classes = getFilteredAndSortedClasses();
    return {
      totalAttendance: classes.reduce((sum, cls) => sum + cls.attendNumber, 0),
      totalHours: classes.reduce((sum, cls) => sum + cls.teachingHours, 0)
    };
  };

  const classes = getFilteredAndSortedClasses();
  const totals = calculateTotals();

  console.log("teacherData : ",teacherData)


  return (
    <div className="container mx-auto h-full w-full bg-blue-200 p-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-6">
        <div className="col-span-6 flex justify-between items-center">
          <p className="text-gray-500">Work Records</p>
          <div className="flex space-x-2">
            <Logout_Button />
          </div>
        </div>
        
        <TeacherNavber teacherId={teacherId} />

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
              <option key={i} value={i + 1}>{i + 1}月</option>
            ))}
          </select>
          <button 
            onClick={() => {}} // 確定按鈕只是觸發重新渲染
            className="bg-blue-400 text-white px-4 py-2 rounded"
          >
            確定
          </button>
        </div>

        <div className="col-span-5 mt-8">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                {[
                  { label: '年份', field: 'year' },
                  { label: '月份', field: 'month' },
                  { label: '日期', field: 'day' },
                  { label: '課程', field: 'courseName' },
                  { label: '科目', field: 'subject' },
                  { label: '年級', field: 'grade' },
                  { label: '出席人數', field: 'attendNumber' },
                  { label: '課程名稱', field: 'className' },
                  { label: '教授時間', field: 'teachingHours' },
                ].map((header) => (
                  <th 
                    key={header.field}
                    onClick={() => handleSort(header.field)}
                    className="p-2 border cursor-pointer hover:bg-gray-300"
                  >
                    {header.label}
                    {sortField === header.field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{cls.year}</td>
                  <td className="p-2">{cls.month}</td>
                  <td className="p-2">{cls.day}</td>
                  <td className="p-2">{cls.courseName}</td>
                  <td className="p-2">{cls.subject}</td>
                  <td className="p-2">{cls.grade}</td>
                  <td className="p-2">{cls.attendNumber}</td>
                  <td className="p-2">{cls.className}</td>
                  <td className="p-2">{cls.teachingHours}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 總計區域 */}
          <div className="mt-4 text-right">
            <p>總出席人數: {totals.totalAttendance}</p>
            <p>總教授時間: {totals.totalHours} 小時</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkRecords;




// "use client"; // 宣告這是客戶端組件，在Next.js中使用

// import { Logout_Button } from "@/components/logout_button"; // 導入登出按鈕組件
// import TeacherNavber from "../_components/navbar"; // 導入教師導航欄組件
// import { useEffect, useState } from "react"; // 從React導入useEffect和useState鉤子
// import { useParams } from "next/navigation"; // 從Next.js導入useParams鉤子用於獲取路由參數

// const WorkRecords = () => { // 定義WorkRecords主組件
//   const param = useParams(); // 獲取路由參數物件
//   const teacherId = param?.teacherId as string; // 從參數中提取teacherId並指定為字串類型

//   const [teacherData, setTeacherData] = useState([]); // 儲存教師數據的狀態，初始值為空陣列
//   const [sortField, setSortField] = useState(null); // 儲存當前排序欄位，初始值為null
//   const [sortOrder, setSortOrder] = useState('asc'); // 儲存排序順序(升序/降序)，初始為升序
//   const [filterYear, setFilterYear] = useState(''); // 儲存年份篩選條件，初始為空字串
//   const [filterMonth, setFilterMonth] = useState(''); // 儲存月份篩選條件，初始為空字串

//   useEffect(() => { // 定義副作用鉤子，用於數據獲取
//     const fetchTeacherData = async (id: string) => { // 定義異步函數獲取教師數據
//       const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`); // 發送API請求獲取數據
//       if (!res.ok) { // 檢查響應是否成功
//         throw new Error("Failed to fetch teacher data"); // 若失敗則拋出錯誤
//       }
//       const result = await res.json(); // 將響應解析為JSON
//       setTeacherData(result); // 更新教師數據狀態
//     };
//     fetchTeacherData(teacherId); // 呼叫數據獲取函數
//   }, [teacherId]); // 當teacherId改變時重新執行

//   // 將所有class展平並添加必要資訊
//   const getAllClasses = () => { // 定義函數來展平並格式化所有課程數據
//     if (!teacherData[0]?.Course) return []; // 如果沒有課程數據，返回空陣列
    
//     return teacherData[0].Course.flatMap(course => // 對每個課程進行展平處理
//       course.class.map(cls => ({ // 將每個class映射為新物件
//         year: new Date(cls.class_date).getFullYear(), // 提取年份
//         month: new Date(cls.class_date).getMonth() + 1, // 提取月份(加1因為從0開始)
//         day: new Date(cls.class_date).getDate(), // 提取日期
//         courseName: course.course_name, // 課程名稱
//         subject: course.course_subject, // 課程科目
//         grade: course.grade, // 年級
//         attendNumber: cls.attend_number, // 出席人數
//         className: cls.title, // 課程標題
//         teachingHours: cls.class_time_h, // 教授時數
//         date: cls.class_date // 完整日期
//       }))
//     );
//   };

//   // 排序功能
//   const handleSort = (field) => { // 定義排序處理函數
//     if (sortField === field) { // 如果點擊的是當前排序欄位
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // 切換排序順序
//     } else { // 如果點擊的是新欄位
//       setSortField(field); // 設置新的排序欄位
//       setSortOrder('asc'); // 預設為升序
//     }
//   };

//   // 篩選和排序後的課程數據
//   const getFilteredAndSortedClasses = () => { // 定義獲取篩選和排序後數據的函數
//     let classes = getAllClasses(); // 獲取所有課程數據

//     // 應用年份和月份篩選
//     if (filterYear) { // 如果有年份篩選條件
//       classes = classes.filter(cls => cls.year === parseInt(filterYear)); // 篩選符合年份的數據
//     }
//     if (filterMonth) { // 如果有月份篩選條件
//       classes = classes.filter(cls => cls.month === parseInt(filterMonth)); // 篩選符合月份的數據
//     }

//     // 應用排序
//     if (sortField) { // 如果有排序欄位
//       classes.sort((a, b) => { // 對數據進行排序
//         const valueA = a[sortField]; // 獲取第一個比較值
//         const valueB = b[sortField]; // 獲取第二個比較值
//         if (sortOrder === 'asc') { // 如果是升序
//           return valueA > valueB ? 1 : -1; // 返回比較結果
//         } else { // 如果是降序
//           return valueA < valueB ? 1 : -1; // 返回相反的比較結果
//         }
//       });
//     }

//     return classes; // 返回處理後的數據
//   };

//   // 計算總計
//   const calculateTotals = () => { // 定義計算總計的函數
//     const classes = getFilteredAndSortedClasses(); // 獲取篩選排序後的數據
//     return {
//       totalAttendance: classes.reduce((sum, cls) => sum + cls.attendNumber, 0), // 計算總出席人數
//       totalHours: classes.reduce((sum, cls) => sum + cls.teachingHours, 0) // 計算總教授時間
//     };
//   };

//   const classes = getFilteredAndSortedClasses(); // 獲取最終的課程數據
//   const totals = calculateTotals(); // 計算總計數據

//   return ( // 開始渲染組件的UI
//     <div className="container mx-auto h-full w-full bg-blue-200 p-4"> // 主容器，使用藍色背景和內邊距
//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-6"> // 使用網格佈局，響應式列數
//         <div className="col-span-6 flex justify-between items-center"> // 標題區域，佔據6列
//           <p className="text-gray-500">Work Records</p> // 顯示標題文字
//           <div className="flex space-x-2"> // 按鈕容器
//             <Logout_Button /> // 渲染登出按鈕
//           </div>
//         </div>
        
//         <TeacherNavber teacherId={teacherId} /> // 渲染教師導航欄，傳入teacherId

//         {/* 篩選區域 */}
//         <div className="col-span-6 flex gap-4"> // 篩選區域容器
//           <input // 年份輸入框
//             type="number" // 數字輸入類型
//             placeholder="年份" // 占位文字
//             value={filterYear} // 綁定年份篩選狀態
//             onChange={(e) => setFilterYear(e.target.value)} // 更新年份篩選狀態
//             className="p-2 border rounded" // 樣式類
//           />
//           <select // 月份選擇下拉框
//             value={filterMonth} // 綁定月份篩選狀態
//             onChange={(e) => setFilterMonth(e.target.value)} // 更新月份篩選狀態
//             className="p-2 border rounded" // 樣式類
//           >
//             <option value="">選擇月份</option> // 預設選項
//             {Array.from({ length: 12 }, (_, i) => ( // 生成12個月份選項
//               <option key={i} value={i + 1}>{i + 1}月</option> // 每個月份選項
//             ))}
//           </select>
//           <button // 確定按鈕
//             onClick={() => {}} // 空函數，僅觸發重新渲染
//             className="bg-blue-400 text-white px-4 py-2 rounded" // 樣式類
//           >
//             確定 // 按鈕文字
//           </button>
//         </div>

//         <div className="col-span-5 mt-8"> // 表格容器，佔據5列
//           <table className="table-auto w-full border-collapse"> // 自適應寬度表格
//             <thead> // 表格頭部
//               <tr className="bg-gray-200"> // 表頭行，使用灰色背景
//                 {[
//                   { label: '年份', field: 'year' }, // 定義表頭欄位陣列
//                   { label: '月份', field: 'month' },
//                   { label: '日期', field: 'day' },
//                   { label: '課程', field: 'courseName' },
//                   { label: '科目', field: 'subject' },
//                   { label: '年級', field: 'grade' },
//                   { label: '出席人數', field: 'attendNumber' },
//                   { label: '課程名稱', field: 'className' },
//                   { label: '教授時間', field: 'teachingHours' },
//                 ].map((header) => ( // 映射生成表頭單元格
//                   <th // 表頭單元格
//                     key={header.field} // 唯一鍵
//                     onClick={() => handleSort(header.field)} // 點擊觸發排序
//                     className="p-2 border cursor-pointer hover:bg-gray-300" // 樣式類
//                   >
//                     {header.label} // 顯示欄位標籤
//                     {sortField === header.field && (sortOrder === 'asc' ? ' ↑' : ' ↓')} // 顯示排序箭頭
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody> // 表格主體
//               {classes.map((cls, index) => ( // 映射生成每行數據
//                 <tr key={index} className="border-b"> // 每行數據，帶底部邊框
//                   <td className="p-2">{cls.year}</td> // 年份單元格
//                   <td className="p-2">{cls.month}</td> // 月份單元格
//                   <td className="p-2">{cls.day}</td> // 日期單元格
//                   <td className="p-2">{cls.courseName}</td> // 課程名稱單元格
//                   <td className="p-2">{cls.subject}</td> // 科目單元格
//                   <td className="p-2">{cls.grade}</td> // 年級單元格
//                   <td className="p-2">{cls.attendNumber}</td> // 出席人數單元格
//                   <td className="p-2">{cls.className}</td> // 課程標題單元格
//                   <td className="p-2">{cls.teachingHours}</td> // 教授時間單元格
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* 總計區域 */}
//           <div className="mt-4 text-right"> // 總計顯示區域，右對齊
//             <p>總出席人數: {totals.totalAttendance}</p> // 顯示總出席人數
//             <p>總教授時間: {totals.totalHours} 小時</p> // 顯示總教授時間
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkRecords; // 導出WorkRecords組件作為默認導出