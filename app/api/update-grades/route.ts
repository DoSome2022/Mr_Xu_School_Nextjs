// app/api/update-grades/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";

export async function POST() {
  const now = new Date().toLocaleString("zh-HK", { timeZone: "Asia/Hong_Kong" });
  const date = new Date(now);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const logMessage = `[${now}] 更新學生年級開始\n`;
  fs.appendFileSync("./grade-update.log", logMessage);

  if (month !== 9 || day !== 1) {
    const skipMessage = `[${now}] 非 9 月 1 日，跳過更新\n`;
    fs.appendFileSync("./grade-update.log", skipMessage);
    return NextResponse.json({ message: skipMessage });
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const students = await tx.student.findMany({
        select: { id: true, grade: true },
      });

      const updates = students.map((student) =>
        tx.student.update({
          where: { id: student.id },
          data: { grade: Math.min(student.grade + 1, 13) },
        })
      );

      const updatedStudents = await Promise.all(updates);
      const successMessage = `[${now}] 成功更新 ${updatedStudents.length} 名學生的年級\n`;
      fs.appendFileSync("./grade-update.log", successMessage);
      return updatedStudents.length;
    });

    return NextResponse.json({ message: `成功更新 ${result} 名學生的年級` });
  } catch (error) {
    const errorMessage = `[${now}] 年級更新失敗: ${error}\n`;
    fs.appendFileSync("./grade-update.log", errorMessage);
    return NextResponse.json({ error: "年級更新失敗" }, { status: 500 ,headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },});
  } finally {
    await db.$disconnect();
  }
}