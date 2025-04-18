"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"
import { Product_Create_Schema } from "@/actions/Create-Product/schema";
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { createProduct_action } from "@/actions/Create-Product";


const Product_Create_Form = () => {

    const [isPending , startTransition] = useTransition();

    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");


    const product_register_form = useForm<z.infer<typeof Product_Create_Schema>>({
        resolver: zodResolver(Product_Create_Schema),
        defaultValues:{
            name: "",
            description: "",
            price : 0,
            product_price_record_id: "",
            stock:0,
        }
    })

    const product_register_form_onSubmit = (values:z.infer<typeof Product_Create_Schema>) => {
        console.log("-- product register輸入 -- : ",values,"-- End --")
        setError("");
        setSuccess("");        

        startTransition(() => {
            createProduct_action(values)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }

    return(
        <>
             <Form {...product_register_form}>
                <form
                    onSubmit={product_register_form.handleSubmit(product_register_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={product_register_form.control}
                    name="name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 商品名稱 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="商品名稱"
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
                    control={product_register_form.control}
                    name="description"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 商品描述 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="商品描述"
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
    control={product_register_form.control}
    name="stock"
    render={({ field }) => (
      <FormItem>
        <FormLabel>商品數量</FormLabel>
        <FormControl>
          <Input
            {...field}
            disabled={isPending}
            placeholder="商品數量"
            type="number" // 改為 number
            value={field.value ?? ""} // 處理 undefined 或 null
            onChange={(e) => field.onChange(Number(e.target.value))} // 轉為數字
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>



                <div className="space-y-4">
                <FormField
                    control={product_register_form.control}
                    name="price"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 錢 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder="價錢"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 
                
                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
            </Form>
        </>
    )
}

export default Product_Create_Form