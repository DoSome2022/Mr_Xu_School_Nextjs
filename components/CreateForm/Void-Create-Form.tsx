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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VoidCreateSchema } from "@/actions/Create-Void/schema";
import { CreateVoid_action } from "@/actions/Create-Void";


const VoidCreateForm = () => {
  const [isPending , startTransition] = useTransition();

  const [ error, setError ] = useState<string | undefined>("");
  const [ success, setSuccess  ] = useState<string | undefined>("");

  const void_create_form = useForm<z.infer< typeof VoidCreateSchema >>({
    resolver: zodResolver(VoidCreateSchema),
    defaultValues:{
      title  : "",
      price : 0,
    }
  })

  const void_create_form_onSubmit = async (data:z.infer< typeof VoidCreateSchema >) => {
    console.log("--  create void -- : ", data ,"-- End --");
    setError("");
    setSuccess("");

    startTransition(() => {
      CreateVoid_action(data)
 
    })

  }

  return (
    <div>
      <h1>VoidCreateForm</h1>
      <Form {...void_create_form}>
        <form onSubmit={void_create_form.handleSubmit(void_create_form_onSubmit)}>

          <FormField
            control={void_create_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field}  type="text" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={void_create_form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>price</FormLabel>
                <FormControl>
                  <Input placeholder="price" {...field}  type="number" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button disabled={isPending} type="submit">
            建立
          </Button>

        </form>
      </Form>

      
    </div>
  );
};

export default VoidCreateForm;