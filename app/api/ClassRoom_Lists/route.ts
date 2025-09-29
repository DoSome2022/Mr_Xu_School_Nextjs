import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行

export async function GET() {
  try {
    const rooms = await db.classroom.findMany({
      include: {
        Class: {
          include: {
            class_course: true,
            student: true,
            Leave: true,
            addClass: true,
            change_class: true,
          },
          where: { isshow: true }, // 可選：只返回 isshow 為 true 的 Class
        },
        Course: {
          where: { isshow: true }, // 可選：只返回 isshow 為 true 的 Course
        },
      },
    });
    return new Response(JSON.stringify(rooms), { status: 200 ,headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },});
  } catch (error) {
    console.error("獲取教室列表錯誤:", error);
    return new Response(JSON.stringify({ error: "無法獲取教室數據" }), { status: 500 });
  }
}