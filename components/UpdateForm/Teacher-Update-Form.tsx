
"use client"


import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from 'next/navigation';

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"
import { Teacher_Update_Schema } from "@/actions/Update-Teacher/schema";
import { updateTeacher } from "@/actions/Update-Teacher";



const Teacher_Update_Form = () => {

    //這個是由user db開始出發拉下去直到teacher data
    const [GetTeacherData , setGetTeacherData] = useState([]);

    const params = useParams();
    const TeacherId = params?.teacherdetailbyID as string;

    const [isPending , startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");

      //拿 teacher data
      useEffect(() => {
        if(TeacherId){
            const fetchTeacherData = async (userId :string) =>{
                //在app/api/Course_data_teacher_by_id/[id]/route.ts
                const res = await fetch(`/api/Course_data_teacher_by_id/${userId}`);
                if(!res){
                    throw new Error("斷線！")
                }
               const result = await res.json();
               setGetTeacherData(result)
            }
            fetchTeacherData(TeacherId)
            }
    },[TeacherId])
    //  console.log(GetTeacherData)

     const [ UserName , setUserName ] = useState('');
     const [ NickName , setNickName ] = useState('');
     const [ Email, setEmail ] = useState('');
     const [ Phone , setPhone ] = useState('');
     const [ Staff , setStaff ] = useState<boolean>(false);
     const [ Isadmin , setIsadmin ] = useState<boolean>(false);




     const teacher_update_form = useForm<z.infer<typeof Teacher_Update_Schema>>({
        resolver: zodResolver(Teacher_Update_Schema),
        defaultValues:{
            teacherid:TeacherId,
            username: UserName,
            nickname: NickName,
            email: Email,
            phone: Phone,
            staff: GetTeacherData.Staff,
            isadmin: GetTeacherData.ISADMIN,
        }
    })


    useEffect(()=>{
        if(GetTeacherData  && GetTeacherData.username){
            setUserName(GetTeacherData.username);
            teacher_update_form.setValue("username", GetTeacherData.username);
        }
        if(GetTeacherData && GetTeacherData.nickname){
            setNickName(GetTeacherData.nickname);
            teacher_update_form.setValue("nickname", GetTeacherData.nickname);
        }
        if(GetTeacherData && GetTeacherData.email){
            setEmail(GetTeacherData.email);
            teacher_update_form.setValue("email", GetTeacherData.email);
        }
        if(GetTeacherData && GetTeacherData.phone){
            setPhone(GetTeacherData.phone);
            teacher_update_form.setValue("phone", GetTeacherData.phone);
        }        
        if(GetTeacherData && GetTeacherData.Staff !== undefined){
            setStaff(GetTeacherData.Staff);
            teacher_update_form.setValue("staff", GetTeacherData.Staff);
        }
        if(GetTeacherData &&  GetTeacherData.ISADMIN !== undefined){
            setIsadmin(GetTeacherData.ISADMIN);
            teacher_update_form.setValue("isadmin", GetTeacherData.ISADMIN);
        }

     },[GetTeacherData])




    const teacher_update_form_onSubmit = (values:z.infer<typeof Teacher_Update_Schema>) =>{
        console.log("-- teacher update輸入 -- : ",values,"-- End --")
        startTransition( async () => {
            const result = await updateTeacher(values);
            if(result.error) {
                setError(result.error);
            } else {
                setEmail("");
            }
        } )
    }




    return(
        <>
{error && <p className="error-message" >{error}</p>}
<br />
<br />

        <Form {...teacher_update_form} >

<form 
    onSubmit={teacher_update_form.handleSubmit(teacher_update_form_onSubmit)}
className="space-y-6">


        <>
            <div className="space-y-4">
                <FormField
                    control={teacher_update_form.control}
                    name="teacherid"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            value={TeacherId}
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
            control={teacher_update_form.control}
            name="username"
            render={({ field }) => (
        <FormItem>
            <FormLabel> 用戶名稱 </FormLabel>
            <FormControl>
                <Input 
                    {...field}
                    disabled={isPending}
                    placeholder={GetTeacherData.username}
                    defaultValue={GetTeacherData.username}
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
            control={teacher_update_form.control}
            name="nickname"
            render={({ field }) => (
        <FormItem>
            <FormLabel> 暱稱 </FormLabel>
            <FormControl>
                <Input 
                    {...field}
                    disabled={isPending}
                    placeholder={GetTeacherData.nickname}
                    defaultValue={GetTeacherData.nickname}
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
            control={teacher_update_form.control}
            name="email"
            render={({ field }) => (
        <FormItem>
            <FormLabel> 電郵 </FormLabel>
            <FormControl>
                <Input 
                    {...field}
                    disabled={isPending}
                    placeholder={GetTeacherData.email}
                    defaultValue={GetTeacherData.email}
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
            control={teacher_update_form.control}
            name="phone"
            render={({ field }) => (
        <FormItem>
            <FormLabel> 電話 </FormLabel>
            <FormControl>
                <Input 
                    {...field}
                    disabled={isPending}
                    placeholder={GetTeacherData.phone}
                    defaultValue={GetTeacherData.phone}
                    type="number"
                    />
            </FormControl>
            <FormMessage />
        </FormItem>
            )}
        />
    </div>

    <div className="space-y-4"
    
    >
                        <FormField 
                            control={teacher_update_form.control}
                            name="staff"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> 職員 </FormLabel>
                                    <FormControl>
                                        <Checkbox 
                                        {...field}
                                            checked={field.value}
                                            onCheckedChange={(staff) => field.onChange(staff)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}  
                        />
                    </div>

                    <div className="space-y-4"
                        
                    >
                        <FormField 
                            control={teacher_update_form.control}
                            name="isadmin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> 是否ADMIN </FormLabel>
                                    <FormControl>
                                        <Checkbox 
                                        {...field}
                                            checked={field.value}
                                            onCheckedChange={(isadmin) =>field.onChange(isadmin)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}  
                        />
                    </div>
        </>


  

    <Button disabled={isPending} type="submit" >

    建立
            </Button>

</form>

</Form>
        </>
    )
}

export default Teacher_Update_Form