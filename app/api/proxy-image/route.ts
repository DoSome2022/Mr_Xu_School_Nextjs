// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
// export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
// export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const imgUrl = searchParams.get("img");
//   if (!imgUrl) {
//     return NextResponse.json({ error: "缺少圖片 URL" }, { status: 400 });
//   }
//   const response = await fetch(imgUrl);
//   const blob = await response.blob();
//   return new Response(blob, {
//     headers: {
//       "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
//       "Content-Disposition": `attachment; filename="booklist-image.jpg"`,
//     },

    
//   });
  
// }


import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("file");

  if (!fileUrl) {
    return NextResponse.json({ error: "缺少文件 URL" }, { status: 400 });
  }

  try {
    const response = await fetch(fileUrl, {
      headers: { Accept: "image/*,application/pdf" },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: `無法獲取文件: ${response.statusText}` },
        { status: response.status }
      );
    }
    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
    const defaultFileName = isImage ? "booklist-image.jpg" : "booklist-document.pdf";
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${defaultFileName}"`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("代理文件失敗:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}