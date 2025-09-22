// // scripts/update-student-grades.ts
// import { db } from "@/lib/db";
// import cron from "node-cron";
// import fs from "fs";

// async function updateStudentGrades() {
//   const now = new Date().toLocaleString("zh-HK", { timeZone: "Asia/Hong_Kong" });
//   const date = new Date(now);
//   const month = date.getMonth() + 1;
//   const day = date.getDate();

//   const logMessage = `[${now}] 更新學生年級開始\n`;
//   fs.appendFileSync("./grade-update.log", logMessage);

//   if (month !== 9 || day !== 1) {
//     const skipMessage = `[${now}] 非 9 月 1 日，跳過更新\n`;
//     fs.appendFileSync("./grade-update.log", skipMessage);
//     console.log(skipMessage);
//     return;
//   }

//   try {
//     const result = await db.$transaction(async (tx) => {
//       const students = await tx.student.findMany({
//         select: { id: true, grade: true },
//       });

//       const updates = students.map((student) =>
//         tx.student.update({
//           where: { id: student.id },
//           data: { grade: Math.min(student.grade + 1, 13) },
//         })
//       );

//       const updatedStudents = await Promise.all(updates);
//       const successMessage = `[${now}] 成功更新 ${updatedStudents.length} 名學生的年級\n`;
//       fs.appendFileSync("./grade-update.log", successMessage);
//       console.log(successMessage);
//       return updatedStudents.length;
//     });
//   } catch (error) {
//     const errorMessage = `[${now}] 年級更新失敗: ${error}\n`;
//     fs.appendFileSync("./grade-update.log", errorMessage);
//     console.error(errorMessage);
//   } finally {
//     await db.$disconnect();
//   }
// }

// // 定時任務：每年 9 月 1 日 00:00（香港時間）
// cron.schedule("0 0 1 9 *", updateStudentGrades, {
//   timezone: "Asia/Hong_Kong",
// });

// console.log("年級更新腳本已啟動，監聽 9 月 1 日...");