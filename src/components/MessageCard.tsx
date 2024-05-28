'use client'

import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Message } from '@/model/user'
import { useToast } from './ui/use-toast'
import axios, { AxiosError } from 'axios'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { ApiResponse } from '@/types/ApiResponse'
  

type MessageCardProops={
    message:Message,
    onMessageDelete:(messageId:string)=>void
}

function MessageCard({message,onMessageDelete}:MessageCardProops) {



const {toast}=useToast()

const handleDeleteConfirm = async () => {
  try {
    const response = await axios.delete<ApiResponse>(
      `/api/deleteMessage/${message._id}`
    );
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id);

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast({
      title: 'Error',
      description:
        axiosError.response?.data.message ?? 'Failed to delete message',
      variant: 'destructive',
    });
  } 
};


  return (
    <>
    <Card>
  <CardHeader>
   


    <AlertDialog>
  <AlertDialogTrigger>  <Button 
  
  
  variant='destructive'>
                <X className="w-5 h-5" />
              </Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>



    
  </CardHeader>
  <CardContent>
    <p>{message.content}</p>
  </CardContent>
 

</Card>
</>
  )
}

export default MessageCard