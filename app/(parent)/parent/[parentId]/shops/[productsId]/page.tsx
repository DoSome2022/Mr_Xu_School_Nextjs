'use client';

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { toast } from 'sonner';
import { createApply } from '@/actions/Create-Apply';

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  Course?: {
    id: string;
    course_name: string;
    startDate?: string | null;
    endDate?: string | null;
    Coursedates: string[];
    timeHours: number;
  };
}

interface Student {
  id: string;
  name: string;
}

interface GetUsername {
  username: string;
}

export default function ProductPage() {
  const { data: session } = useSession();
  const param_id = useParams();
  const productId = param_id.productsId as string;
  const userId = param_id.parentId as string;
  const router = useRouter();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [getProduct, setGetProduct] = useState<ProductDetail | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [getUsername, setGetUsername] = useState<GetUsername[] | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/other/User_Parent/${session?.user?.id}`);
        if (!response.ok) throw new Error('無法獲取用戶名');
        const data = await response.json();
        console.log('Fetched username data:', data);
        setGetUsername(data);
      } catch (error) {
        console.error('獲取用戶名失敗:', error);
        setError('無法載入用戶名');
      }
    };
    fetchUsername();
  }, [session]);

  useEffect(() => {
    const fetchProductDataLists = async (productId: string) => {
      try {
        const response = await fetch(`/api/Product_detail_data_by_id/${productId}`);
        if (!response.ok) throw new Error('無法獲取商品數據');
        const data = await response.json();
        setGetProduct(data);
      } catch (error) {
        console.error('獲取商品數據失敗:', error);
        setError('無法載入商品詳情');
      }
    };

    fetchProductDataLists(productId);
  }, [productId]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/user/${session.user.id}/students`);
        if (!response.ok) throw new Error('無法獲取子女數據');
        const data = await response.json();
        console.log('Students data:', data);
        setStudents(data);
      } catch (error) {
        console.error('獲取子女數據失敗:', error);
        setError('無法載入子女清單');
      }
    };
    fetchStudents();
  }, [session]);

  const handleSubmitApplication = async () => {
    console.log('handleSubmitApplication called', { selectedStudentId, getUsername, isPending, userId, sessionUserId: session?.user?.id });
    
    if (!selectedStudentId) {
      setError('請選擇一位子女');
      toast.error('請選擇一位子女');
      console.log('Error: No student selected');
      return;
    }

    if (!getUsername || getUsername.length === 0 || !getUsername[0].username) {
      setError('用戶未登錄或缺少用戶名');
      toast.error('請先登錄或確保用戶名已載入');
      console.log('Error: No username available');
      return;
    }

    if (!userId || userId !== session?.user?.id) {
      setError('無效的用戶 ID 或與當前登錄用戶不匹配');
      toast.error('無效的用戶 ID');
      console.log('Error: Invalid or mismatched userId', { userId, sessionUserId: session?.user?.id });
      return;
    }

    startTransition(async () => {
      console.log('startTransition started');
      try {
        const result = await createApply({
          product_id: productId,
          username: getUsername[0].username,
          apply: true,
          apply_student_id: selectedStudentId,
          course_id: getProduct?.Course?.id || '',
          course_name: getProduct?.Course?.course_name || getProduct?.title || '未知課程',
          parent_id: userId,
          applystate: 'PENDING',
        });

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          console.log('createApply error:', result.error);
          return;
        }

        toast.success('申請提交成功！');
        console.log('-- Apply -- :', result, '-- END --');
        router.push(`/parent/${userId}/shops`);
      } catch (error) {
        console.error('提交申請失敗:', error);
        const errorMsg = error instanceof Error ? `提交申請失敗：${error.message}` : '無法提交申請';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    });
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '未設置';
    try {
      return format(new Date(dateStr), 'yyyy-MM-dd');
    } catch {
      return '無效日期';
    }
  };

  if (!getProduct) {
    return <div className="container mx-auto p-4 text-white bg-gray-900">{error ?? '載入中...'}</div>;
  }

  console.log("let me cc !! :", session, "-- END --");
  console.log("let me cc !!-username :", getUsername, "-- END --");
  console.log(" params :", param_id, "-- END --")

  return (
    <div className="container mx-auto p-4 text-white bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">課程詳情</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{getProduct.title}</h2>
        <p className="text-gray-400">{getProduct.description}</p>
        {getProduct.Course && (
          <div className="mt-4">
            <p className="text-gray-400">
              <span className="font-semibold">課程開始日期：</span>
              {formatDate(getProduct.Course.startDate)}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold">課程結束日期：</span>
              {formatDate(getProduct.Course.endDate)}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold">課程日期：</span>
              {getProduct.Course.Coursedates.length > 0
                ? getProduct.Course.Coursedates.map(formatDate).join(', ')
                : '無具體日期'}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold">課程總時數：</span>
              {getProduct.Course.timeHours} 小時
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">選擇子女</label>
          <Select
            value={selectedStudentId ?? undefined}
            onValueChange={(value) => {
              console.log('Selected student ID:', value);
              setSelectedStudentId(value);
            }}
            disabled={isPending || students.length === 0}
          >
            <SelectTrigger className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md">
              <SelectValue placeholder="選擇一位子女" />
            </SelectTrigger>
            <SelectContent>
              {students.length > 0 ? (
                students.map((student) => (
                  <SelectItem
                    key={student.id}
                    value={student.id}
                    className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 cursor-pointer"
                  >
                    {student.name}
                  </SelectItem>
                ))
              ) : (
                <div className="bg-gray-800 text-gray-400 px-4 py-2">無子女資料</div>
              )}
            </SelectContent>
          </Select>
          {selectedStudentId && (
            <p className="text-gray-400 text-sm mt-2">
              已選擇：{students.find((s) => s.id === selectedStudentId)?.name || '未知學生'}
            </p>
          )}
        </div>
        <div
          className={`flex items-center gap-2 ${selectedStudentId ? 'mt-4' : 'mt-0'} transition-all duration-300`}
        >
          <button
            onClick={() => {
              console.log('Submit button clicked');
              handleSubmitApplication();
            }}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
              isPending || !selectedStudentId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isPending || !selectedStudentId}
          >
            {isPending ? '提交中...' : '提交申請'}
          </button>
        </div>
      </div>
    </div>
  );
}