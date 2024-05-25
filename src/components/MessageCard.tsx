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
import axios from 'axios'
  

type MessageCardProops={
    message:Message,
    onMessageDelete:(messageId:string)=>void
}

function MessageCard({message,onMessageDelete}:MessageCardProops) {



const {toast}=useToast()
const handelDeleteConform=async()=>{
const response=await axios.delete(`/api/deleteMessage/${message._id}`)

toast({
    title:response.data.message
})

onMessageDelete(message._id)

}


  return (
    <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>


    <AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
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
      <AlertDialogAction onClick={handelDeleteConform}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>



    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
 

</Card>

  )
}

export default MessageCard