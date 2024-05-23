import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest,NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:NextRequest) {
    await dbConnect()

    try {

        let verifyCode=Math.floor(10000+Math.random()*90000).toString()
    const {username,email,password}=  await  await request.json()

    const existingUserVerifiedByUsername= await UserModel.findOne({
        username,
        isVerified:true
    })

    if (existingUserVerifiedByUsername) {
        return NextResponse.json({
            success: false,
            message:"user is already registered"
        },{status:400})
        
    }

const existingUserByEmail=await UserModel.findOne({email})

if (existingUserByEmail) {
   if (existingUserByEmail.isVerified) {
    return Response.json(
        {
          success: false,
          message: "user already exists with this email",
        },
        { status: 500 }
      );
   }
   else{
    const hashedPassword= await bcrypt.hash(password,10);
    existingUserByEmail.password = hashedPassword;
    
    existingUserByEmail.verifyCode = verifyCode;

    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
    await existingUserByEmail.save();
   }
}
else{
    const hashedpassword=await bcrypt.hash(password,10)

    const expireDate= new Date;
    expireDate.setHours(expireDate.getHours()+2)

    const newUser=new UserModel({
        username,
        email,
        password: hashedpassword,
        verifyCode:verifyCode,
        verifyCodeExpiry: expireDate, 
        isVerified: false,
        isAcceptingMessages: true,
        messages: []
    })
    await newUser.save()
}

//send verification email

const emailResponse = await sendVerificationEmail(
    email,
    username,
    verifyCode
  );
  if (!emailResponse.success) {
    return Response.json(
      {
        success: false,
        message: emailResponse.message,
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      success: true,
      message: 'User registered successfully. Please verify your account.',
    },
    { status: 201 }
  );

} 


catch (error) {
        console.error('error registering user', error)
        return NextResponse.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}