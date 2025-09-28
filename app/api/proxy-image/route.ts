import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imgUrl = searchParams.get("img");
  if (!imgUrl) {
    return NextResponse.json({ error: "缺少圖片 URL" }, { status: 400 });
  }
  const response = await fetch(imgUrl);
  const blob = await response.blob();
  return new Response(blob, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
      "Content-Disposition": `attachment; filename="booklist-image.jpg"`,
    },

    
  });
  
}