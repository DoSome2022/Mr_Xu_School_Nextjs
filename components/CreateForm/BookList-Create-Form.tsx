"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";

import Image from "next/image"; 

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"




import { Booklist_Create_Schema } from "@/actions/Create-Booklist/schema";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { createBooklist } from "@/actions/Create-Booklist";


interface SchoolData {
    id: string;
    school_name : string;
}

interface BookList_Create_FormProps{
    SchoolId : string;
    data: SchoolData[]
}


const BookList_Create_Form = ({SchoolId , data}: BookList_Create_FormProps) =>{

          console.log("-- School Data : --",data[0],"-- end --")

        const [ SchoolName , setSchoolName ] = useState('');

        useEffect(()=>{
           if(data && data[0] && data[0].school_name){
            setSchoolName(data[0].school_name);
            booklist_create_form.setValue("school_name", data[0].school_name)
           }
        },[data ])

    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const [isPending , startTransition] = useTransition();
    const [PreviewImage, setPreviewImage] = useState<string | null>(null);


        const booklist_create_form = useForm<z.infer<typeof Booklist_Create_Schema >>({
        resolver : zodResolver(Booklist_Create_Schema),

        defaultValues:{
            name: "",
            school_name: SchoolName,
            year: "",
            grade:0,
            img:"",
            school_booklist_id: SchoolId
        }

    })
  // 處理圖片上傳
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onload = () => {
//         const base64String = reader.result as string;
//         booklist_create_form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

  // 處理圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        booklist_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);

      setPreviewImage(URL.createObjectURL(file));
    }
  };




    const  booklist_create_form_onSubmit =  (values : z.infer<typeof Booklist_Create_Schema> ) =>{
        console.log("--  create booklist -- : ", values ,"-- End --");
        setError("");
        setSuccess("");
        startTransition(() => {
            createBooklist(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }

    return(
        <>
                      {error && <div className="text-red-500 mb-4">{error}</div>}
                      {success && <div className="text-green-500 mb-4">{success}</div>}
            <Form {...booklist_create_form}>
                <form
                    onSubmit={booklist_create_form.handleSubmit(booklist_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <div className="space-y-4">
                <FormField
                    control={booklist_create_form.control}
                    name="name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
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

        {data.map((d)=>{
            
            return(
                
                <>
            
            <div className="space-y-4">
                <FormField
                    control={booklist_create_form.control}

                    name="school_name"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 學校名稱 </FormLabel>
                    <FormControl>

                <Input 
                {...field}
                placeholder={d.school_name}
                defaultValue={d.school_name}
                type="text"
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


                {/* <div className="space-y-4" >
                <FormField
                    control={booklist_create_form.control}
                    name="school_booklist_id"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            type="text"
                            value={
                                SchoolId
                            }
                            disabled
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div>  */}


                <div className="space-y-4">
                <FormField
                    control={booklist_create_form.control}
                    name="year"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年份 </FormLabel>
                    <FormControl>
                        <SWR_School_Year field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={booklist_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                </div> 


                <div className="space-y-4">
                <FormField
                    control={booklist_create_form.control}
                    name="img"
                    render={({ field }) => (
                        <>
                <FormItem> 
            <FormLabel>上傳</FormLabel> 
            <FormControl>

                   <Input 
                {...field}
                disabled={isPending}
                
                type="hidden"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
            </FormControl> 
            </FormItem>
        <FormItem> 

            <FormControl>

                   <Input 

                disabled={isPending}
                onChange={handleImageUpload}
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
        </FormControl> 
        </FormItem>
                        </>
                    )}
                />

                </div> 

                <Button disabled={isPending} type="submit">
                    建立
                </Button>

                </form>
            </Form>

                {PreviewImage && (
          <Image
            width={500}
            height={500}
            src={PreviewImage}
            alt="預覽圖片"
            className="mt-4"
          />
        )}
        </>
    )
}
export default BookList_Create_Form

