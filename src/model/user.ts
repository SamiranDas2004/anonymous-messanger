import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document{
content:string,
createdAt:Date
}