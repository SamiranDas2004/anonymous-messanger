import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';

import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: Request, {params}:{params:{messageId:string}}) {
  
  const messageID=params.messageId
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User
console.log(user);

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },  
      { status: 401 }
    );
  }

  try {
  const updateResult=  await UserModel.updateOne(
      {_id:user._id},
      {$pull:{messages:{_id:messageID}}}
    )

if (updateResult.matchedCount===0) {
  return Response.json({
    success:false,
    message:"Message Not Found Or Already Deleted"
  },
{status:200}
)
}


  } catch (error:any) {
    return Response.json({
      success:false,
      message:" Error in deleting message"
    },
  {status:500}
  )
  }
  }
