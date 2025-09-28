// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { Prisma } from "@prisma/client";

// // 定義回應型別
// type TeacherResponse = {
//   id: string;
//   username: string;
//   teacherTimeWork: {
//     P_HR: number;
//     JHS_HR: number;
//     HS_HR: number;
//     P_number: number;
//     JHS_number: number;
//     HS_number: number;
//   }[];
//   courses: {
//     id: string;
//     course_name: string;
//     course_subject: string;
//     grade: number;
//     persons: number;
//   }[];
// };

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json({ message: "缺少教師 ID" }, { status: 400 });
//     }

//     const teacher = await db.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         username: true,
//         teacherTimeWork: {
//           select: {
//             P_HR: true,
//             JHS_HR: true,
//             HS_HR: true,
//             P_number: true,
//             JHS_number: true,
//             HS_number: true,
//           },
//         },
//         courses: {
//           select: {
//             id: true,
//             course_name: true,
//             course_subject: true,
//             grade: true,
//             persons: true,
//           },
//         },
//       },
//     });

//     if (!teacher) {
//       return NextResponse.json({ message: "未找到教師數據" }, { status: 404 });
//     }

//     return NextResponse.json(teacher as TeacherResponse);
//   } catch (error) {
//     console.error("獲取教師數據失敗:", error);
//     return NextResponse.json({ message: "內部服務器錯誤" }, { status: 500 });
//   }
// }



import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

// 定義回應型別
type TeacherResponse = {
  id: string;
  username: string | null;
  teacher_time_work: {
    P_HR: number;
    JHS_HR: number;
    HS_HR: number;
    P_number: number;
    JHS_number: number;
    HS_number: number;
  }[];
  Course: {
    id: string;
    course_name: string;
    course_subject: string;
    grade: number;
    persons: number;
  }[];
};

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "缺少教師 ID" }, { status: 400 });
    }

    // 驗證 ID 格式（假設使用 CUID）
    if (!id.match(/^[c][0-9a-zA-Z]{24}$/)) {
      return NextResponse.json({ message: "無效的教師 ID" }, { status: 400 });
    }

    const teacher = await db.staffUser.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        teacher_time_work: {
          select: {
            P_HR: true,
            JHS_HR: true,
            HS_HR: true,
            P_number: true,
            JHS_number: true,
            HS_number: true,
          },
        },
        Course: {
          select: {
            id: true,
            course_name: true,
            course_subject: true,
            grade: true,
            persons: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ message: "未找到教師數據" }, { status: 404 
        ,headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },});
    }

    return NextResponse.json(teacher as TeacherResponse);
  } catch (error) {
    console.error("獲取教師數據失敗:", error);
    return NextResponse.json({ message: "內部服務器錯誤" }, { status: 500 });
  }
}