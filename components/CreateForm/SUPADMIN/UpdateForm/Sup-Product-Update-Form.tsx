"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { Product_Update_Schema } from "@/actions/Update-Product/schema";
import { updateProduct_action } from "@/actions/Update-Product";
import { SupupdateProduct_action } from "@/actions/supadmin/Update-Product";
import { SupProduct_Update_Schema } from "@/actions/supadmin/Update-Product/schema";

const Product_Update_Formbysupadmin = () => {
    const params = useParams<{ProductDetailbyID: string}>();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const [ isPending , startTransition ] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const ProductID = params?.ProductDetailbyID as string;

    const [ GetProductDataById , setGetProductDataById ] = useState([]);
    useEffect(()=>{
        if(ProductID) {
            const fetchproductdetailbyid = async (id: string) => {
                try {
                    const res = await fetch(`/api/Product_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetProductDataById(result);                    
                    } catch (error) {
                        console.error(error);
                    }
            };
            fetchproductdetailbyid(ProductID)
        }

    },[ProductID])
    
     console.log()

    const [GetName ,setGetName] = useState('');
    const [GetDescription ,setGetDescription] = useState('');
    const [GetPrice ,setGetPrice] = useState(0);

    const product_update_form = useForm<z.infer<typeof SupProduct_Update_Schema>>({
        resolver: zodResolver(SupProduct_Update_Schema),
        defaultValues:{
            supadminid:supadminid,
            productid: ProductID,
            name: GetName,
            description: GetDescription,
            price : GetPrice,
        }
    })

    useEffect(()=>{
        if(GetProductDataById && GetProductDataById[0] !== undefined){
            setGetName(GetProductDataById[0].name);
            product_update_form.setValue("name", GetProductDataById[0]?.name);
        }
        if(GetProductDataById && GetProductDataById[0] !== undefined){
            setGetDescription(GetProductDataById[0].description);
            product_update_form.setValue("description", GetProductDataById[0]?.description);
        }
        if(GetProductDataById && GetProductDataById[0] !== undefined){
            setGetPrice(GetProductDataById[0].price);
            product_update_form.setValue("price", parseFloat(GetProductDataById[0]?.price));
        }
    },[GetProductDataById])

    console.log("GetName : ",GetName ,"GetDescription : ", GetDescription , "GetPrice : ",GetPrice)


    const product_update_form_onSubmit = (values:z.infer<typeof SupProduct_Update_Schema>) => {
        console.log("-- product update輸入 -- : ",values,"-- End --")
        setError("");
        setSuccess("");        

        startTransition( async () => {
        const result  = await SupupdateProduct_action(values)
            if (result.error) {
                setError(result.error);
            } else {
                 setError("")
            }
        })
    }
    return(
        <>
               <br />
        {error && <p className="error-message" >{error}</p>}
        <br />
        <br />
        <Form {...product_update_form}>
                <form
                    onSubmit={product_update_form.handleSubmit(product_update_form_onSubmit)}
                    className="space-y-6"
                >
                
{GetProductDataById.map((d)=>{
    return(
        <>
            <div className="space-y-4"
            hidden>
                <FormField
                    control={product_update_form.control}
                    name="productid"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            value={ProductID}
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
                    control={product_update_form.control}
                    name="name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 商品名稱 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder={d.name}
                type="text"
                defaultValue={d.name}
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 

                <div className="space-y-4">
                <FormField
                    control={product_update_form.control}
                    name="description"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 商品描述 </FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder={d.description}
                type="text"
                defaultValue={d.description}
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={product_update_form.control}
                    name="price"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 錢 :{d.price} , 下面更改</FormLabel>
                    <FormControl>
                    <Input 
                {...field}
                disabled={isPending}
                placeholder={d.price}
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                defaultValue={d.price}
                
                />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 
        
        </>
    )
})}

               
                
                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
            </Form>
        
        </>
    )


}

export default Product_Update_Formbysupadmin