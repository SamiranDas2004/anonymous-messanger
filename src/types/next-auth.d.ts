import "next-auth";

declare module 'next-auth'{
    interface User {
      email?:string;
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
      }

      interface Session{
        user:{
            _id?: string;
            email?:string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
        }
      }
}
declare module 'next-auth/jwt' {
    interface JWT {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    }
  }