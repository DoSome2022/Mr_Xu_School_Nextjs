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
import { CreateClassRoomSchema } from "@/actions/Create-ClassRoom/schema";
import { SWR_Class_Room } from "../fatchdata/swrclass_room";
import { CreateClassRoomAction } from "@/actions/Create-ClassRoom";

const CreateClassRoomFormbysupadmin = () => {
    const [isPending, startTransition] = useTransition();
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");


    const classroom_create_form = useForm<z.infer<typeof CreateClassRoomSchema>>({
      resolver: zodResolver(CreateClassRoomSchema),
      defaultValues:{
        room:  "",
      }
    })

   const classroom_create_form_onSubmit = async (values: z.infer<typeof CreateClassRoomSchema>) => { 
    console.log("--  create classroom -- : ", values ,"-- End --");
    setError("");
    setSuccess("");

    startTransition( () => {
      CreateClassRoomAction(values)
      .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
      
    }
    );

  };


  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <Form {...classroom_create_form}>
        <form onSubmit={classroom_create_form.handleSubmit(classroom_create_form_onSubmit)}>
              
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