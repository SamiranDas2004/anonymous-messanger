import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log(user);

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "not aithenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "failed to accept mesages",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "user is accepting message",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "failed to accept mesages",
      },
      { status: 500 }
    );
  }
}


export async function GET(request:NextRequest) {
    const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log(user);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "not aithenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;

try {
    const foundUser=await UserModel.findById(userId)
    
    if (!foundUser) {
        return NextResponse.json(
          {
            success: false,
            message: "failed to found user",
          },
          { status: 401 }
        );
      }
    
      return NextResponse.json(
        {
          success: true,
          isAcceptingMessages:foundUser.isAcceptingMessages
        },
        { status: 200 }
      );
} catch (error) {
    return NextResponse.json(
        {
          success: false,
          message: "failed to accept mesages",
        },
        { status: 500 }
      );
}
}