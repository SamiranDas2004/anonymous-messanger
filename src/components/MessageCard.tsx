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
import { Button } from './ui/button'
import { X } from 'lucide-react'
  

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
      <AlertDialogAction onClick={handelDeleteConform}>Continue</AlertDialogAction>
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