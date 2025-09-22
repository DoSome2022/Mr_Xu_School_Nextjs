"use client";

import * as z from "zod";
import { useState ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input"; 

import { Button } from "@/components/ui/button";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import { CreateClassRoomAction } from "@/actions/Create-ClassRoom";
import { SWR_Class_Room } from "@/components/fatchdata/swrclass_room";
import { useParams } from "next/navigation";
import { SupCreateClassRoomSchema } from "@/actions/supadmin/Create-ClassRoom/schema";
import { SupCreateClassRoomAction } from "@/actions/supadmin/Create-ClassRoom";

const CreateClassRoomFormbysupadmin = () => {
    const [isPending, startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const param = useParams();
    console.log("param :",  param ,"--end --"  )
    const supadminid = param?.supadminid as string;
    console.log("supadminid :", supadminid);



    const classroom_create_form = useForm<z.infer<typeof SupCreateClassRoomSchema>>({
      resolver: zodResolver(SupCreateClassRoomSchema),
      defaultValues:{
        room:  "",
        supadminId: supadminid
      }
    })

const classroom_create_form_onSubmit = async (values: z.infer<typeof SupCreateClassRoomSchema>) => {
  console.log("-- create classroom-sup -- : ", values, "-- End --");
  setError("");
  setSuccess("");
  startTransition(() => {
    SupCreateClassRoomAction(values).then((data) => {
      setError(data?.error);
      setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "課室創建成功" : undefined);
    });
  });
};


  return (
    <>
      {/* {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>} */}
      <Form {...classroom_create_form}>
        <form onSubmit={classroom_create_form.handleSubmit(classroom_create_form_onSubmit)}>
          <div className="text-red-500 mb-4">{error}</div>
    <div className="text-green-500 mb-4">
      {typeof success === "string" ? success : success ? "課室創建成功" : undefined}
    </div>
              
              <div className="space-y-4">

              <FormField
                control={classroom_create_form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>課室</FormLabel>
                    <FormControl>
                      <SWR_Class_Room field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              </div>

          <Button disabled={isPending} type="submit">
          建立
        </Button>

        </form>
      </Form>
    </>
  );
};

export default CreateClassRoomFormbysupadmin;