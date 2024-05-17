import { Message } from "postcss"
export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean
    messages?:Array<Message>
}