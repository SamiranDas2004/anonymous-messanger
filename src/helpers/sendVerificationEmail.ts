import {resend} from '@/lib/resend'

import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse>{
   try {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'verification code ',
        react:VerificationEmail({username,otp:verifyCode}),
      });

    return {success:true,message:"success to send verification email"}
   } catch (error) {
    console.error("error on sending email",error)
    return {success:false,message:"faild to send verification email"}
   }
}