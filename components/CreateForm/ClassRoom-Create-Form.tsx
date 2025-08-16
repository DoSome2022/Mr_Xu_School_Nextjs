"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { CreateClassRoomSchema } from "@/actions/Create-ClassRoom/schema";
import { SWR_Class_Room } from "../fatchdata/swrclass_room";
import { CreateClassRoomAction } from "@/actions/Create-ClassRoom";

const CreateClassRoomForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const classroom_create_form = useForm<z.infer<typeof CreateClassRoomSchema>>({
    resolver: zodResolver(CreateClassRoomSchema),
    defaultValues: {
      room: "",
    },
  });

  const classroom_create_form_onSubmit = async (
    values: z.infer<typeof CreateClassRoomSchema>
  ) => {
    console.log("-- create classroom -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(() => {
      CreateClassRoomAction(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <Form {...classroom_create_form}>
      <form
        onSubmit={classroom_create_form.handleSubmit(classroom_create_form_onSubmit)}
        className="space-y-6"
      >
        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>
        )}
        {success && (
          <div className="text-green-500 bg-green-100 p-3 rounded-md">{success}</div>
        )}
        <FormField
          control={classroom_create_form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">課室名稱</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入課室名稱"
                  className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          type="submit"
          className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
        >
          {isPending ? "正在建立..." : "建立課室"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateClassRoomForm;