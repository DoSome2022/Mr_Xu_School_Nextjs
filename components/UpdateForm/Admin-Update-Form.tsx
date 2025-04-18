
"use client"


import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input"; 
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"
import { Admin_Update_Schema } from "@/actions/Update-Admin/schema";
import { updateAdmin } from "@/actions/Update-Admin";


const Admin_Update_Form = () =>{
    const params = useParams<{admindetailbyID: string}>();
    const SupAdminID = params?.admindetailbyID as string;

    const [isPending , startTransition] = useTransition();
    const [GetSupAdminDetailByID , setGetSupAdminDetailByID] = useState([]);
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");


    useEffect(()=>{
        if(SupAdminID) {
            const fetchsupadmindetailbyid = async (id: string) => {
                try {
                    const res = await fetch(`/api/SupAdmin_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetSupAdminDetailByID(result);                    
                    } catch (error) {
                        console.error(error);
                    }
            };
            fetchsupadmindetailbyid(SupAdminID)
        }

    },[SupAdminID])

    // console.log(GetSupAdminDetailByID)
    const [GetUserName , setGetUserName] = useState('');
    const [GetNickName , setGetNickName] = useState('');
    const [GetEmail , setGetEmail] = useState('');
    const [GetPhone , setGetPhone] = useState('');
    const [GetStaff , setGetStaff] = useState();
    const [GetIsadmin , setGetIsadmin] = useState();
    const [GetCram , setGetCram] = useState('');


    const admin_update_form = useForm<z.infer<typeof Admin_Update_Schema>>({
        resolver: zodResolver(Admin_Update_Schema),
        defaultValues:{
            userid: SupAdminID ,
            username: GetUserName,
            nickname: GetNickName,
            email: GetEmail,
            phone: GetPhone,
            staff: GetStaff,
            isadmin: GetIsadmin,
            cram: GetCram
        }
    })


    useEffect(()=>{
        if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].username){
            setGetUserName(GetSupAdminDetailByID[0].username);
            admin_update_form.setValue("username", GetSupAdminDetailByID[0].username);
        }
        if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].nickname){
            setGetNickName(GetSupAdminDetailByID[0].nickname);
            admin_update_form.setValue("nickname", GetSupAdminDetailByID[0].nickname);
        }
        if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].email){
            setGetEmail(GetSupAdminDetailByID[0].email);
            admin_update_form.setValue("email", GetSupAdminDetailByID[0].email);
        }
        if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].phone){
            setGetPhone(GetSupAdminDetailByID[0].phone);
            admin_update_form.setValue("phone", GetSupAdminDetailByID[0].phone);
        }
        if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].Staff){
            setGetStaff(GetSupAdminDetailByID[0].Staff);
            admin_update_form.setValue("staff", GetSupAdminDetailByID[0].Staff);
        }
        if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].ISADMIN){
            setGetIsadmin(GetSupAdminDetailByID[0].ISADMIN);
            admin_update_form.setValue("isadmin", GetSupAdminDetailByID[0].ISADMIN);
        }
        if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].cram){
            setGetCram(GetSupAdminDetailByID[0].cram);
            admin_update_form.setValue("cram", GetSupAdminDetailByID[0].cram);
        }
    },[GetSupAdminDetailByID])





    const admin_update_form_onSubmit = (values:z.infer<typeof Admin_Update_Schema>) =>{
        console.log("-- admin update輸入 -- : ",values,"-- End --")
        setError("");
        setSuccess("");

        startTransition( async () => {
        const result = await updateAdmin(values)
        if (result.error) {
            setError(result.error);
          } else {
            setError("")
          }
        } )
    }

    
    return(
        <>
        Admin_Update_Form
        <br />
        {error && <p className="error-message" >{error}</p>}
        <br />
        <br />
        <Form {...admin_update_form} >

        <form 
            onSubmit={admin_update_form.handleSubmit(admin_update_form_onSubmit)}
        className="space-y-6">

        {GetSupAdminDetailByID.map((d)=>{
            return(
                <>
            <div className="space-y-4">
                <FormField
                    control={admin_update_form.control}
                    name="userid"
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input 
                            {...field}
                            value={SupAdminID}
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
                    control={admin_update_form.control}
                    name="username"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 用戶名稱 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder={d.username}
                            defaultValue={d.username}
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
                    control={admin_update_form.control}
                    name="nickname"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 暱稱 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder={d.nickname}
                            defaultValue={d.nickname}
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
                    control={admin_update_form.control}
                    name="email"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 電郵 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder={d.email}
                            defaultValue={d.email}
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
                    control={admin_update_form.control}
                    name="phone"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 電話 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder={d.phone}
                            defaultValue={d.phone}
                            type="number"
                            />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div>

            <div className="space-y-4">
                <FormField
                    control={admin_update_form.control}
                    name="cram"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 分校 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
                            disabled={isPending}
                            placeholder={d.cram}
                            defaultValue={d.cram}
                            type="text"
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
                            control={admin_update_form.control}
                            name="staff"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> 職員 </FormLabel>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            defaultValue={d.staff}
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
                            control={admin_update_form.control}
                            name="isadmin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> 是否ADMIN </FormLabel>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            defaultValue={d.isadmin}
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

<Button disabled={isPending} type="submit" >

更改
</Button>

</form>

</Form>

        </>
    )
}

export default Admin_Update_Form