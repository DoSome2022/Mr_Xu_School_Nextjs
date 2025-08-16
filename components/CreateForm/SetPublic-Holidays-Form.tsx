// "use client";

// import * as z from "zod";
// import { useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import { useSearchParams } from "next/navigation";

// // import { Input } from "@/components/ui/input"; 

// import { Button } from "@/components/ui/button";

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from "@/components/ui/form"
// import { public_holiday_create_Schema } from "@/actions/Create-PublicHoliday/schema";
// import DatePicker from "react-multi-date-picker";
// import { createPublic_holiday } from "@/actions/Create-PublicHoliday";
// // import { SWR_Class_Time } from "../fatchdata/swrclass_tiime";


// const Public_Holidays_Form = () => {
//     const [ isPending , startTransition ] = useTransition();
//     const publicholidays_create_form = useForm<z.infer<typeof public_holiday_create_Schema>>({
//             resolver: zodResolver(public_holiday_create_Schema),
//             defaultValues:{
//                 publicholiday : [],
//             }
//         })



//         // 提交表單
//     const publicholidays_create_form_onSubmit = (values : z.infer<typeof public_holiday_create_Schema>) => {
//         console.log("--  create publicholidays -- : ", values ,"-- End --");

//         startTransition(() => {
//             createPublic_holiday(values);
//         })
//     }
// console.log("bug : ",publicholidays_create_form,"-- End --" )

// return (
//     <>
//         <Form {...publicholidays_create_form}>
//             <form
//                 onSubmit={publicholidays_create_form.handleSubmit(publicholidays_create_form_onSubmit)}
//                 className="space-y-4"
//             >
//                 <div className="space-y-4"> 
//             <FormField 
//                 control={publicholidays_create_form.control}
//                 name="publicholiday"
//                 render={({ field }) =>(
//                     <FormItem>
//                         <FormLabel>選擇公眾假期</FormLabel>
//                         <FormControl>
//                         <DatePicker
//                                     multiple // 啟用多選
//                                     value={field.value?.map((date : any) => new Date(date)) || []}
//                                     onChange={(dates:any) => {
//                                         const formattedDates = dates?.map((date:any) => 
//                                             new Date(date).toISOString()
//                                         ) || [];
//                                         field.onChange(formattedDates);
//                                     }}
//                                     format="YYYY-MM-dd"
//                                 />
//                         </FormControl>
//                         <FormMessage />
//                     </FormItem>
//                 )}            
//             />
// </div>


//                 <Button type="submit" disabled={isPending}>
//                     提交
//                 </Button>
//             </form>
//         </Form>
//     </>
// );

// }

// export default Public_Holidays_Form

"use client";

import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { public_holiday_create_Schema } from "@/actions/Create-PublicHoliday/schema";
import DatePicker from "react-multi-date-picker";
import { createPublic_holiday } from "@/actions/Create-PublicHoliday";

const Public_Holidays_Form = () => {
  const [isPending, startTransition] = useTransition();
  const publicholidays_create_form = useForm<
    z.infer<typeof public_holiday_create_Schema>
  >({
    resolver: zodResolver(public_holiday_create_Schema),
    defaultValues: {
      publicholiday: [],
    },
  });

  const publicholidays_create_form_onSubmit = (
    values: z.infer<typeof public_holiday_create_Schema>
  ) => {
    console.log("-- create publicholidays -- : ", values, "-- End --");
    startTransition(() => {
      createPublic_holiday(values);
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-md p-6 max-w-md mx-auto">
      <Form {...publicholidays_create_form}>
        <form
          onSubmit={publicholidays_create_form.handleSubmit(
            publicholidays_create_form_onSubmit
          )}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={publicholidays_create_form.control}
              name="publicholiday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold text-[#e7915b]">
                    選擇公眾假期
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      multiple
                      value={
                        field.value?.map((date: any) => new Date(date)) || []
                      }
                      onChange={(dates: any) => {
                        const formattedDates =
                          dates?.map((date: any) =>
                            new Date(date).toISOString()
                          ) || [];
                        field.onChange(formattedDates);
                      }}
                      format="YYYY-MM-DD"
                      containerClassName="w-full"
                      inputClass="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e7915b] transition-colors duration-300 hover:border-[#e7915b]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm font-medium" />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#e7915b] text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300 disabled:opacity-50"
          >
            提交
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Public_Holidays_Form;