import {z } from 'zod'

export const verifySchema= z.object({
    code:z.string().length(5,'verification code must be 6 digits')
})