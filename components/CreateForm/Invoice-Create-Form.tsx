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
    <Form {...invoice_create_form}>
      <form
        onSubmit={invoice_create_form.handleSubmit(invoice_create_form_onSubmit)}
        className="space-y-6"
      >

        <div className="space-y-4">
          <FormField
            control={invoice_create_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="標題"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="space-y-4">
          <FormField
            control={invoice_create_form.control}
            name="Invoice_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>商品code碼</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="商品code碼"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={invoice_create_form.control}
            name="servetype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>服務類型</FormLabel>
                <FormControl>
                  <SWR_Server_Type field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 relative">
          <FormField
            control={invoice_create_form.control}
            name="studentname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學生名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="點擊選擇學生"
                    type="text"
                    onClick={() => setShowStudentList(true)}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showStudentList && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-lg max-h-96 overflow-y-auto">
              <div className="p-2">
                <Input
                  type="text"
                  placeholder="搜尋學生 (姓名、學校、年級、父母用戶名或暱稱)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              {filteredStudents.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">姓名</th>
                      <th className="border p-2 text-left">學校</th>
                      <th className="border p-2 text-left">年級</th>
                      <th className="border p-2 text-left">父母用戶名</th>
                      <th className="border p-2 text-left">父母暱稱</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSelectStudent(student)}
                      >
                        <td className="border p-2">{student.name}</td>
                        <td className="border p-2">{student.school}</td>
                        <td className="border p-2">{student.grade}</td>
                        <td className="border p-2">{student.Parent_data?.username || "N/A"}</td>
                        <td className="border p-2">{student.Parent_data?.nickname || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-2 text-gray-500">無匹配學生</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <FormField
            control={invoice_create_form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>內容</FormLabel>
                <FormControl>
                  <div>
                    {selectedProducts.length > 0 ? (
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 text-left">選中產品</th>
                            <th className="border p-2 text-left">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProducts.map((product) => (
                            <tr key={product.id}>
                              <td className="border p-2">
                                {product.name} | 價格: {product.price} | 庫存: {product.stock}
                              </td>
                              <td className="border p-2">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => handleRemoveProduct(product.id)}
                                  disabled={isPending}
                                >
                                  減掉
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500">尚未選擇產品</p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
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

        {/* <div className="space-y-4">
          <FormField
            control={invoice_create_form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>價錢</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    disabled={true} // 設置為只讀
                    placeholder="價錢"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
        
<div className="space-y-4">
  <FormField
    control={invoice_create_form.control}
    name="DB"
    render={({ field }) => (
      <FormItem>
        <FormLabel>拆扣價錢</FormLabel>
        <FormControl>
          <Input
            {...field}
            value={field.value ?? ""} // 確保空值時顯示空字符串
            placeholder="輸入價格"
            type="number"
            onChange={(e) => field.onChange(e.target.value)} // 確保傳遞字符串
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

 <div className="space-y-4">
  <FormField
    control={invoice_create_form.control}
    name="adminFee"
    render={({ field }) => (
      <FormItem>
        <FormLabel>雜項/行政</FormLabel>
        <FormControl>
          <Input
            {...field}
            value={field.value ?? ""} // 確保空值時顯示空字符串
            placeholder="輸入價格"
            type="number"
            onChange={(e) => field.onChange(e.target.value)} // 確保傳遞字符串
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

<div className="space-y-4">
  <FormField
    control={invoice_create_form.control}
    name="price"
    render={({ field }) => (
      <FormItem>
        <FormLabel>價錢</FormLabel>
        <FormControl>
          <Input
            {...field}
            value={field.value ?? ""} // 確保空值時顯示空字符串
            placeholder="輸入價格"
            type="number"
            onChange={(e) => field.onChange(e.target.value)} // 確保傳遞字符串
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>


        <Button
          type="button"
          onClick={() => setShowProductList(!showProductList)}
          disabled={isPending}
        >
          {showProductList ? "隱藏產品列表" : "加入產品"}
        </Button>

        {showProductList && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">產品列表</h3>
            {GetproductData.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">名稱</th>
                    <th className="border p-2 text-left">價格</th>
                    <th className="border p-2 text-left">庫存</th>
                    <th className="border p-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {GetproductData.map((product) => (
                    <tr key={product.id}>
                      <td className="border p-2">{product.name}</td>
                      <td className="border p-2">{product.price}</td>
                      <td className="border p-2">{product.stock}</td>
                      <td className="border p-2">
                        <Button
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          disabled={
                            isPending ||
                            selectedProducts.some((p) => p.id === product.id)
                          }
                        >
                          加入
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>無產品數據</p>
            )}
          </div>
        )}

        <FormError message={error} />
        <FormSuccess message={success} />
        <br />
        <Button disabled={isPending} type="submit">
          建立
        </Button>
      </form>
    </Form>
  );
};

export default Invoice_Create_Form;