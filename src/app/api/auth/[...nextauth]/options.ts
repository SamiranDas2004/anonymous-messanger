import CredentialsProvider from "next-auth/providers/credentials";

import { NextAuthOptions } from "next-auth";

import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",

            credentials: {
                email: { label: "email", type: "text"},
                password: { label: "Password", type: "password" }
              },

 async authorize(credentials:any):Promise<any> {
 
                await dbConnect()
                try {
              const user= await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("no user is found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("user is not verified please verifi before login")
                    }

          const isPasswordverified=   await bcrypt.compare(credentials.password,user.password)

          if (!isPasswordverified) {
            throw new  Error('incorrect Password')
          }else{
            return user
          }
                } catch (error:any) {
                    throw new Error
                }
              }
        })

    ],
    callbacks: {
      
        async session({ session , token }) {


            session.user._id=token._id;
            session.user.isAcceptingMessages=token.isAcceptingMessages;
            session.user.isVerified=token.isVerified;
            session.user.username=token.username
          return session
        },
        async jwt({ token, user }) {

            if (user) {
                token._id=user._id?.toString()
                token.isVerified=user.isVerified
                token.username=user.username
                token.isAcceptingMessages=user.isAcceptingMessages
            }

          return token
        }
   
    },
    pages:{
        signIn: '/signin'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}