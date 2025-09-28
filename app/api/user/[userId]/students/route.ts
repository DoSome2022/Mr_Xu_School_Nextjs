import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

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