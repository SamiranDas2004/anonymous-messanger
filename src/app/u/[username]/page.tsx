"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import { z } from "zod";
import { useCompletion } from 'ai/react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "lucide-react";
import debounce from 'lodash.debounce';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString = "What&apos;s Love?||Baby don&apos;t hurt me!||Babu tum clear kardo.";

const Message: React.FC = () => {
  const { complete, completion, isLoading: isSuggestLoading, error } = useCompletion({
    api: '/api/suggest-message',
    initialCompletion: initialMessageString,
  });

  const { username } = useParams<{ username: string }>();
  const [newUsername, setUsername] = useState(username || "");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/api/sendMessage`, {
        username: data.username,
        content: data.content,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to send the message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = useCallback(
    debounce(async () => {
      try {
        if (!isSuggestLoading) {
          await complete('');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, 3000), // Adjust debounce delay as necessary
    [isSuggestLoading, complete]
  );

  return (
    <>
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Public Profile Link</h1>
        <p>Sending message to &quot;{newUsername}&quot;</p>
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
                        placeholder="Send TO (Username)"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                      />
                    </div>
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
            <Button type="submit" disabled={isLoading}>Submit</Button>
          </form>
        </Form>
      </div>

      <div>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button onClick={fetchSuggestedMessages} className="my-4" disabled={isSuggestLoading}>
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default Message;
