import { Content } from 'next/font/google'
import {z } from 'zod'

export const messageSchema= z.object({
    Content:z.string().min(10,{message:"must be more than 10 charecters"})
})