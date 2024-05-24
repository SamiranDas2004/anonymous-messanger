import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signupSchema';
import { NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation
});

export async function GET(request: Request) {
  await dbConnect(); 

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get('username')
    };

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: usernameError.length > 0 ? usernameError.join(', ') : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    console.log("this is the result data:", result.data);

    const { username } = result.data;

    const existingUser = await UserModel.findOne({ username, isVerified: true });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is not available"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error in CheckingUsername", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking username"
      },
      { status: 500 }
    );
  }
}
