
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
import { VoidCreateSchema } from "@/actions/Create-Void/schema";
import { CreateVoid_action } from "@/actions/Create-Void";

const VoidCreateFormbysupadmin = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const void_create_form = useForm<z.infer<typeof VoidCreateSchema>>({
    resolver: zodResolver(VoidCreateSchema),
    defaultValues: {
      title: "",
      price: 0,
    },
  });

  const void_create_form_onSubmit = async (
    data: z.infer<typeof VoidCreateSchema>
  ) => {
    console.log("-- create void -- : ", data, "-- End --");
    setError("");
    setSuccess("");

    startTransition(() => {
      CreateVoid_action(data);
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <Form {...void_create_form}>
        <form
          onSubmit={void_create_form.handleSubmit(void_create_form_onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={void_create_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">
                  標題
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="請輸入標題"
                    {...field}
                    type="text"
                    disabled={isPending}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e7915b] transition-colors duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={void_create_form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e7915b] font-medium">
                  價錢
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="請輸入價錢"
                    {...field}
                    type="number"
                    disabled={isPending}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e7915b] transition-colors duration-300"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#e7915b] text-white font-medium hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300"
          >
            建立
          </Button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </form>
      </Form>
    </div>
  );
};

export default VoidCreateFormbysupadmin;