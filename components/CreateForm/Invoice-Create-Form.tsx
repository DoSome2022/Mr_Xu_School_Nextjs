"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Invoice_Create_Schema } from "@/actions/Create-Invoice/schema";
import { createInvoice_action } from "@/actions/Create-Invoice";
import { SWR_Payment_Methods_checkbox } from "../fatchdata/swrpayment_methods";
import { SWR_Server_Type } from "../fatchdata/swrserver_type";



interface ProductData {
  id: string;
  description: string;
  price: number;
  stock: number;
  product_price_record_id: string;
  name: string;
}

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: number;
  student_parent_data_id: string;
  Parent_data?: {
    username: string;
    nickname: string;
  };
}

const Invoice_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetproductData, setGetproductData] = useState<ProductData[]>([]);
  const [showProductList, setShowProductList] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductData[]>([]);
  const [GetStudent, setGetStudent] = useState<StudentData[]>([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/Product_Lists");
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        // 將 price 轉為數字
        const transformedData = data.map((product: ProductData) => ({
          ...product,
          price: Number(product.price),
        }));
        setGetproductData(transformedData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProductData();
  }, []);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch("/api/student/Student_AllLists");
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        setGetStudent(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);

  const invoice_create_form = useForm<z.infer<typeof Invoice_Create_Schema>>({
    resolver: zodResolver(Invoice_Create_Schema),
    defaultValues: {
      title: "",
      content: [],
      studentname: "",
      student_id: "",
      price: 0,
      PaymentMethods: [],
      Invoice_id: "",
      servetype: "",
      DB:0,
      adminFee:0,
    },
  });

  // Calculate total price
  const totalPrice = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  // Update form content and price
  useEffect(() => {
    const content = selectedProducts.map(
      (product) => `${product.name} | 價格: ${product.price} | 庫存: ${product.stock}`
    );
    invoice_create_form.setValue("content", content, { shouldValidate: true });
    invoice_create_form.setValue("price", totalPrice, { shouldValidate: true });
  }, [selectedProducts, invoice_create_form]);

  const handleAddProduct = (product: ProductData) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleSelectStudent = (student: StudentData) => {
    invoice_create_form.setValue("studentname", student.name, { shouldValidate: true });
    invoice_create_form.setValue("student_id", student.id, { shouldValidate: true });
    setShowStudentList(false);
    setSearchTerm("");
  };

  const filteredStudents = GetStudent.filter((student) =>
    [
      student.name,
      student.school,
      String(student.grade),
      student.Parent_data?.username || "",
      student.Parent_data?.nickname || "",
    ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const invoice_create_form_onSubmit = (values: z.infer<typeof Invoice_Create_Schema>) => {
    console.log("-- create invoice -- : ", values, "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      createInvoice_action(values).then((data) => {
        setError(data?.error ?? undefined);
        setSuccess(data?.success ?? undefined);
      });
    });
  };

  console.log("Bug : ", invoice_create_form.formState.errors, "-- Bug --");

 return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#e7915b] mb-6">創建發票</h1>
            
            <Form {...invoice_create_form}>
              <form
                onSubmit={invoice_create_form.handleSubmit(invoice_create_form_onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 標題 */}
                  <FormField
                    control={invoice_create_form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">標題</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="發票標題"
                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 商品code碼 */}
                  <FormField
                    control={invoice_create_form.control}
                    name="Invoice_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">商品code碼</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="商品識別碼"
                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 服務類型 */}
                  <FormField
                    control={invoice_create_form.control}
                    name="servetype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">服務類型</FormLabel>
                        <FormControl>
                          <SWR_Server_Type field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 學生選擇 */}
                  <div className="relative">
                    <FormField
                      control={invoice_create_form.control}
                      name="studentname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">學生名稱</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="點擊選擇學生"
                              onClick={() => setShowStudentList(true)}
                              readOnly
                              className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {showStudentList && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-[#e7915b] rounded-lg shadow-lg max-h-96 overflow-y-auto">
                        <div className="p-3">
                          <Input
                            type="text"
                            placeholder="搜尋學生 (姓名、學校、年級、父母用戶名或暱稱)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                          />
                        </div>
                        {filteredStudents.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-[#e7915b] text-white">
                                  <th className="p-3 text-left">姓名</th>
                                  <th className="p-3 text-left">學校</th>
                                  <th className="p-3 text-left">年級</th>
                                  <th className="p-3 text-left">父母用戶名</th>
                                  <th className="p-3 text-left">父母暱稱</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredStudents.map((student) => (
                                  <tr
                                    key={student.id}
                                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleSelectStudent(student)}
                                  >
                                    <td className="p-3">{student.name}</td>
                                    <td className="p-3">{student.school}</td>
                                    <td className="p-3">{student.grade}</td>
                                    <td className="p-3">{student.Parent_data?.username || "N/A"}</td>
                                    <td className="p-3">{student.Parent_data?.nickname || "N/A"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="p-3 text-gray-500 text-center">無匹配學生</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 價格相關字段 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={invoice_create_form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">價錢</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="輸入價格"
                            type="number"
                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={invoice_create_form.control}
                    name="DB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">折扣價錢</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="輸入折扣"
                            type="number"
                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={invoice_create_form.control}
                    name="adminFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">雜項/行政費</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="輸入費用"
                            type="number"
                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 已選產品 */}
                <div className="bg-gray-50 p-4 rounded-lg border border-[#e7915b]">
                  <h3 className="text-lg font-semibold text-[#e7915b] mb-3">已選產品</h3>
                  {selectedProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#e7915b] text-white">
                            <th className="p-3 text-left">產品名稱</th>
                            <th className="p-3 text-left">價格</th>
                            <th className="p-3 text-left">庫存</th>
                            <th className="p-3 text-left">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProducts.map((product) => (
                            <tr key={product.id} className="border-b border-gray-200">
                              <td className="p-3">{product.name}</td>
                              <td className="p-3">{product.price}</td>
                              <td className="p-3">{product.stock}</td>
                              <td className="p-3">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => handleRemoveProduct(product.id)}
                                  disabled={isPending}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  移除
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">尚未選擇產品</p>
                  )}
                </div>

                {/* 支付方式 */}
                <div className="bg-white p-4 rounded-lg border border-[#e7915b]">
                  <h3 className="text-lg font-semibold text-[#e7915b] mb-3">支付方式</h3>
                  <FormField
                    control={invoice_create_form.control}
                    name="PaymentMethods"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SWR_Payment_Methods_checkbox
                            field={{
                              control: invoice_create_form.control,
                              name: "PaymentMethods",
                              disabled: isPending,
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 產品列表 */}
                <div className="bg-white p-4 rounded-lg border border-[#e7915b]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-[#e7915b]">產品列表</h3>
                    <Button
                      type="button"
                      onClick={() => setShowProductList(!showProductList)}
                      disabled={isPending}
                      className="bg-[#e7915b] hover:bg-[#d9824c] text-white"
                    >
                      {showProductList ? "隱藏列表" : "顯示產品列表"}
                    </Button>
                  </div>

                  {showProductList && GetproductData.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#e7915b] text-white">
                            <th className="p-3 text-left">名稱</th>
                            <th className="p-3 text-left">價格</th>
                            <th className="p-3 text-left">庫存</th>
                            <th className="p-3 text-left">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {GetproductData.map((product) => (
                            <tr key={product.id} className="border-b border-gray-200">
                              <td className="p-3">{product.name}</td>
                              <td className="p-3">{product.price}</td>
                              <td className="p-3">{product.stock}</td>
                              <td className="p-3">
                                <Button
                                  type="button"
                                  onClick={() => handleAddProduct(product)}
                                  disabled={
                                    isPending ||
                                    selectedProducts.some((p) => p.id === product.id)
                                  }
                                  className="bg-[#e7915b] hover:bg-[#d9824c] text-white"
                                >
                                  加入
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 表單消息和提交按鈕 */}
                <div className="flex flex-col space-y-4">
                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="bg-[#e7915b] hover:bg-[#d9824c] text-white w-full md:w-auto self-end"
                  >
                    {isPending ? "處理中..." : "創建發票"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Invoice_Create_Form;


// "use client";

// import React, { useState, useEffect, useTransition } from "react";
// import * as z from "zod";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import DatePicker from "react-multi-date-picker";
// import { timetemplate_create_Schema } from "@/actions/Create-TimeTemplate/schema";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import useSWR from "swr";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_Class_Lesson } from "../fatchdata/swrclass_lesson";
// import { SWR_Class_Time } from "../fatchdata/swrclass_tiime";
// import { createtimetemplate } from "@/actions/Create-TimeTemplate";

// const formatDate = (dateStr) => {
//     if (!dateStr || typeof dateStr !== 'string') return null;
//     const date = new Date(dateStr);
//     return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
// };

// const TimeTemplate_Create_Form = () => {
//     const fetcher = (...args) => fetch(...args).then((res) => res.json());
//     const { data } = useSWR('http://127.0.0.1:8000/api/course_data/courselessons/', fetcher);
//     const [isPending, startTransition] = useTransition();
//     const [selectedDays, setSelectedDays] = useState([]);
//     const [dayStart, setDayStart] = useState('');
//     const [dayEnd, setDayEnd] = useState('');
//     const [selectedWeekdays, setSelectedWeekdays] = useState({});
//     const [GetPublicHolidays, setGetPublicHolidays] = useState([]);
//     const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

//     const timetemplate_create_form = useForm<z.infer<typeof timetemplate_create_Schema>>({
//         resolver: zodResolver(timetemplate_create_Schema),
//         defaultValues: {
//             title: "",
//             day_start: "",
//             day_end: "",
//             publicholiday: [],
//             weekdays: [],
//             days: [],
//             start_time: "",
//             end_time: "",
//             grade: 0,
//             lesson: ""
//         }
//     });

//     // ...保持原有的 useEffect 和数据处理逻辑...

//     const handleWeekdayChange = (dayIndex, checked) => {
//         setSelectedWeekdays(prev => ({ ...prev, [dayIndex]: checked }));
//     };

//     const isDateRangeSelected = dayStart && dayEnd;
//     const isWeekdaySelected = Object.values(selectedWeekdays).some(Boolean);

//     const updateDayField = (index, fieldName, value) => {
//         const currentDays = timetemplate_create_form.getValues('days');
//         const updatedDays = [...currentDays];
//         updatedDays[index] = { ...updatedDays[index], [fieldName]: value };
//         timetemplate_create_form.setValue('days', updatedDays);
//     };

//     const timetemplate_create_form_onSubmit = (values: z.infer<typeof timetemplate_create_Schema>) => {
//         startTransition(() => {
//             createtimetemplate(values);
//         });
//     };

//     return (
//         <Form {...timetemplate_create_form}>
//             <form onSubmit={timetemplate_create_form.handleSubmit(timetemplate_create_form_onSubmit)} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* 标题和年级 */}
//                     <FormField
//                         control={timetemplate_create_form.control}
//                         name="title"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel className="text-gray-700">標題</FormLabel>
//                                 <FormControl>
//                                     <Input 
//                                         {...field} 
//                                         disabled={isPending} 
//                                         placeholder="模板標題" 
//                                         className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         control={timetemplate_create_form.control}
//                         name="grade"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel className="text-gray-700">年級</FormLabel>
//                                 <FormControl>
//                                     <SWR_School_Grade field={field} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     {/* 日期范围选择 */}
//                     <FormField
//                         control={timetemplate_create_form.control}
//                         name="day_start"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel className="text-gray-700">開始日期</FormLabel>
//                                 <FormControl>
//                                     <Controller
//                                         name="day_start"
//                                         control={timetemplate_create_form.control}
//                                         render={({ field: { onChange, value } }) => (
//                                             <DatePicker
//                                                 value={value ? new Date(value) : null}
//                                                 format="YYYY-MM-DD"
//                                                 onChange={(date) => {
//                                                     const isoDate = date ? date.format("YYYY-MM-DD") : "";
//                                                     onChange(isoDate);
//                                                     setDayStart(isoDate);
//                                                 }}
//                                                 inputClass="w-full p-2 border border-[#e7915b] rounded-md"
//                                             />
//                                         )}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         control={timetemplate_create_form.control}
//                         name="day_end"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel className="text-gray-700">結束日期</FormLabel>
//                                 <FormControl>
//                                     <Controller
//                                         name="day_end"
//                                         control={timetemplate_create_form.control}
//                                         render={({ field: { onChange, value } }) => (
//                                             <DatePicker
//                                                 value={value ? new Date(value) : null}
//                                                 format="YYYY-MM-DD"
//                                                 onChange={(date) => {
//                                                     const isoDate = date ? date.format("YYYY-MM-DD") : "";
//                                                     onChange(isoDate);
//                                                     setDayEnd(isoDate);
//                                                 }}
//                                                 inputClass="w-full p-2 border border-[#e7915b] rounded-md"
//                                             />
//                                         )}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//                 {/* 公共假期显示 */}
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                     <h3 className="font-semibold text-[#e7915b] mb-2">公共假期</h3>
//                     {isLoadingHolidays ? (
//                         <p className="text-gray-500">載入假期數據中...</p>
//                     ) : Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 && GetPublicHolidays[0].publicholiday ? (
//                         <div className="flex flex-wrap gap-2">
//                             {GetPublicHolidays[0].publicholiday.map((date, index) => {
//                                 const formattedDate = formatDate(date);
//                                 return formattedDate ? (
//                                     <span key={index} className="bg-[#e7915b] text-white px-2 py-1 rounded text-sm">
//                                         {formattedDate}
//                                     </span>
//                                 ) : null;
//                             })}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">無公共假期數據</p>
//                     )}
//                 </div>

//                 {/* 周日期选择 */}
//                 <div className="bg-white p-4 rounded-lg border border-[#e7915b]">
//                     <h3 className="font-semibold text-[#e7915b] mb-4">選擇週日期</h3>
//                     {isDateRangeSelected ? (
//                         <div className="space-y-4">
//                             <div className="flex flex-wrap gap-4">
//                                 {["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"].map((day, index) => (
//                                     <label key={index} className="flex items-center space-x-2 cursor-pointer">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedWeekdays[index + 1] || false}
//                                             onChange={(e) => handleWeekdayChange(index + 1, e.target.checked)}
//                                             className="h-4 w-4 text-[#e7915b] focus:ring-[#e7915b] border-gray-300 rounded"
//                                         />
//                                         <span className="text-gray-700">{day}</span>
//                                     </label>
//                                 ))}
//                             </div>

//                             {isWeekdaySelected && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                                     <FormField
//                                         control={timetemplate_create_form.control}
//                                         name="start_time"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel className="text-gray-700">開始時間</FormLabel>
//                                                 <FormControl>
//                                                     <SWR_Class_Time
//                                                         field={field}
//                                                         disabled={!isDateRangeSelected}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />

//                                     <FormField
//                                         control={timetemplate_create_form.control}
//                                         name="end_time"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel className="text-gray-700">結束時間</FormLabel>
//                                                 <FormControl>
//                                                     <SWR_Class_Time
//                                                         field={field}
//                                                         disabled={!isDateRangeSelected}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">請先選擇日期範圍</p>
//                     )}
//                 </div>

//                 {/* 特定日期选择 */}
//                 <div className="bg-white p-4 rounded-lg border border-[#e7915b]">
//                     <h3 className="font-semibold text-[#e7915b] mb-4">選擇特定日期</h3>
//                     {isDateRangeSelected ? (
//                         <>
//                             <Controller
//                                 name="days"
//                                 control={timetemplate_create_form.control}
//                                 render={({ field: { onChange, value } }) => (
//                                     <DatePicker
//                                         multiple
//                                         value={value ? value.map(day => new Date(day.date)) : []}
//                                         minDate={dayStart ? new Date(dayStart) : null}
//                                         maxDate={dayEnd ? new Date(dayEnd) : null}
//                                         onChange={(dates) => {
//                                             setSelectedDays(dates);
//                                             const formattedDays = dates.map(date => ({
//                                                 date: date.format("YYYY-MM-DD"),
//                                                 start_time: "",
//                                                 end_time: "",
//                                                 lesson: ""
//                                             }));
//                                             onChange(formattedDays);
//                                         }}
//                                         format="YYYY-MM-DD"
//                                         disabled={!isDateRangeSelected}
//                                         inputClass="w-full p-2 border border-[#e7915b] rounded-md"
//                                     />
//                                 )}
//                             />

//                             {selectedDays.length > 0 && (
//                                 <div className="mt-4 space-y-3">
//                                     {selectedDays.map((day, index) => (
//                                         <div key={index} className="border border-[#e7915b] p-3 rounded-lg">
//                                             <div className="font-medium text-[#e7915b] mb-2">
//                                                 日期: {day.format("YYYY-MM-DD")}
//                                             </div>
//                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                                                 <div>
//                                                     <label className="block text-sm text-gray-700 mb-1">開始時間</label>
//                                                     <SWR_Class_Time
//                                                         field={{
//                                                             value: timetemplate_create_form.getValues('days')[index]?.start_time || "",
//                                                             onChange: (value) => updateDayField(index, 'start_time', value)
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm text-gray-700 mb-1">結束時間</label>
//                                                     <SWR_Class_Time
//                                                         field={{
//                                                             value: timetemplate_create_form.getValues('days')[index]?.end_time || "",
//                                                             onChange: (value) => updateDayField(index, 'end_time', value)
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm text-gray-700 mb-1">課程</label>
//                                                     <SWR_Class_Lesson
//                                                         field={{
//                                                             value: timetemplate_create_form.getValues('days')[index]?.lesson || "",
//                                                             onChange: (value) => updateDayField(index, 'lesson', value)
//                                                         }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </>
//                     ) : (
//                         <p className="text-gray-500">請先選擇日期範圍</p>
//                     )}
//                 </div>

//                 <div className="flex justify-end">
//                     <Button 
//                         type="submit" 
//                         disabled={!isDateRangeSelected || isPending}
//                         className="bg-[#e7915b] hover:bg-[#d9824c] text-white"
//                     >
//                         {isPending ? "處理中..." : "創建時間模板"}
//                     </Button>
//                 </div>
//             </form>
//         </Form>
//     );
// };

// export default TimeTemplate_Create_Form;