"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupProduct_Update_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            productid,
            name,
            description,
            price,
        } = data;

    let Product_data;

    try {
        Product_data = await db.product.update({
            where:{
                id: productid
            },
            data:{
                name : name,
                description: description,
                price : price
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- Product_update_Data -- : " , Product_data , " -- End -- ")
    return { data: Product_data }
}

export const SupupdateProduct_action = CreateSafeAction(SupProduct_Update_Schema, handler)