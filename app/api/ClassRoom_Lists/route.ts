import { db } from "@/lib/db";

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