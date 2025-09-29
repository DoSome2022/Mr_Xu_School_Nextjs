import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';  // 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
export const fetchCache = 'force-no-store';  // 強制禁用所有 fetch 快取
export const revalidate = 0;  // 設定重新驗證時間為 0 秒，確保每次請求動態執行

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const session = await auth();
  
  if (!session?.user || session.user.id !== params.userId) {
    return NextResponse.json({ error: '未授權' }, { status: 401 });
  }

  try {
    const students = await db.user.findUnique({
      where: { id: params.userId },
      select: {
        Student: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(students?.Student || [], {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',  // 額外添加回應頭部，強化禁用快取
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
  } catch (error) {
    console.error('獲取子女數據失敗:', error);
    return NextResponse.json({ error: '無法獲取子女數據' }, { status: 500 });
  }
}