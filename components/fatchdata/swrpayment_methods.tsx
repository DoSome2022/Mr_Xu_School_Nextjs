"use client";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"



import { Checkbox } from "@/components/ui/checkbox"

import useSWR from "swr";
import { Control, FieldValues, Path } from "react-hook-form";


interface SWRPaymentMethods {
    id: string
    payment_method: string
}

interface PaymentMethodsData<T extends FieldValues> {
    control: Control<T, any>;
    name: Path<T>;
    disabled?: boolean;
}

const fetcher = (url: string):Promise<SWRPaymentMethods[]> => fetch(url).then((res) => res.json());

export const SWR_Payment_Methods_checkbox = <T extends FieldValues>({field}:{field:PaymentMethodsData<T>}) => { 
    const { data, error, isLoading } = useSWR<SWRPaymentMethods[]>("http://127.0.0.1:8000/api/paymentMethods/paymentmethods", fetcher);

if (error) return <>錯誤: {error.message || "無法載入數據"}</>;
if (isLoading) return <>載入中...</>;
if (!data?.length) return <>無可用的付款方式</>;

    return(
        <div className="space-y-4">
            <FormLabel className="text-base" >付款方式</FormLabel>
            {data.map((datas)=>(
                <FormField
                    key={datas.id}
                    control={field.control}
                    name={field.name}
                    render={({field})=>(
                        <FormItem 
                            key={datas.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                        >
                            <FormControl>
                                <Checkbox
                                    checked={(field.value as string[]).includes(datas.payment_method)}
                                    onCheckedChange={(checked) => {
                                        const value = field.value as string[];
                                        if (checked) {
                                          field.onChange([...value, datas.payment_method]);
                                        } else {
                                          field.onChange(
                                            value.filter((item) => item !== datas.payment_method)
                                          )
                                        }
                                    }}
                                    disabled={field.disabled}
                                />

                            </FormControl>
                            <FormLabel>{datas.payment_method}</FormLabel>
                            <FormMessage/>
                        </FormItem>
            )}
                >

                </FormField>
            ))}
        </div>
    )

};

