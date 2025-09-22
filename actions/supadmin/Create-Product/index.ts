"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupProduct_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            supadminid,
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
    } catch (error) {
        console.log(error)
    }
    console.log("-- Product_Data -- : " , Product_data , " -- End -- ")
    return redirect(`/supadmin/${supadminid}/productLists`)
}

export const SupcreateProduct_action = CreateSafeAction(SupProduct_Create_Schema, handler)