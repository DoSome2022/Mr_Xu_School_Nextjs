"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Product_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            description,
            price,
            product_price_record_id,
            stock,
            Course_id
        } = data;

    let Product_data;

    try {
        Product_data = await db.product.create({
            data:{
                name : name,
                description: description,
                price : price,
                product_price_record_id : product_price_record_id,
                stock : stock,
                Course_id : Course_id,
                
            }
        });
        revalidatePath(`/admin/productLists`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- Product_Data -- : " , Product_data , " -- End -- ")
    return redirect(`/admin/productLists`)
}

export const createProduct_action = CreateSafeAction(Product_Create_Schema, handler)