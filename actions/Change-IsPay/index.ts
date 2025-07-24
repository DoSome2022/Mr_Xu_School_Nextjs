"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { IsPay_Change_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
    
    const {invoiceId , IsPay} = data;
    let invoice_change;
    let receipt_data;
    let invoice_data ; 
    try {
        invoice_change = await db.invoice.update({
            where:{
                id:invoiceId
            },
            data:{
                isPayment:IsPay
            }
        })

        invoice_data = await db.invoice.findUnique({
            where:{
                id:invoiceId
            }
        })
        
        receipt_data = await db.receipt.create({
            data:{
                title:invoice_data?.title,
                content:invoice_data?.content,
                price:invoice_data?.price,
                invoicebydbid:invoiceId,
                servetype:invoice_data?.servetype,
                isPayment:IsPay,
                studentname:invoice_data?.studentname,
                Invoice_id:invoice_data?.Invoice_id,
                PaymentMethods:invoice_data?.PaymentMethods,
                DB:invoice_data?.DB,
                adminFee:invoice_data?.adminFee,
            }
        })


    }  catch (error) {
        console.log(error)
    }

    console.log("-- invoice_change -- : " , invoice_change , " -- End -- ")
    console.log("-- receipt_data -- : " , receipt_data , " -- End -- ")
    return redirect(`/admin/InvoiceLists/`)
}

export const IsPay_Change_Action = CreateSafeAction(IsPay_Change_Schema, handler);