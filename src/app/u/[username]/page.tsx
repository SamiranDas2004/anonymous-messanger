"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import { z } from "zod";

const Message: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  // console.log(params);
  const [newUsername, setUsername] = useState(username || "");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post(`/api/sendMessage`, {
        username: data.username,
        content: data.content,
      });
      console.log("API response:", response.data); // Log the entire response object
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to ",
        variant: "destructive",
      }); // Log the error object
    }
  };

  return (
    <div className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-4xl font-bold">Public Profile Link</h1>
      <p>Sending message to " {newUsername} "</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To -----{">"}</FormLabel>
                <FormControl>
                  <div className="flex justify-center items-center ">
                     <Input
                      className="w-1/2 border border-black focus:border-black"
                    placeholder="Send TO"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  /></div>
                 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="flex justify-center items-center ">
                    <input
                      className="w-1/2 border border-black focus:border-black"
                      placeholder="Send message"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default Message;
