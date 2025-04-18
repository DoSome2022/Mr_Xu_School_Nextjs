import bcrypt from "bcryptjs";
import credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { Login_Schema, staffUser_Login_Schema } from "./schemas"; 
import { getStaffUserByUserName, getUserByUserName } from "./data/user";

//authjsＶ５　的自定登入設定
export default{providers: [
    credentials({
        
        async authorize(credentials , req) {
            console.log("-- credentials -- : ",credentials ,"-- end --")

            console.log(credentials)
                        //普通用戶登入
           if(credentials.role === "PARENT") {
            console.log('testmessage :  is work')
            const login_form_validatedFields = Login_Schema.safeParse(credentials);
                if (login_form_validatedFields.success) {
                const { username , password } = login_form_validatedFields.data;
                //用戶檢查
                const user = await getUserByUserName(username);
                //username / password 錯會
                if (!user || !user.password) return console.error("no user or no pw (user)");;
                //PW解碼
                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password,
                );
                //PW ＆＆　username 沒問題　在DB 最user 資料
                        console.log('is work')
                    if(passwordsMatch) return user

               
                } else {
                //輸入form 錯誤
                console.error("form have wrong (user) : ", login_form_validatedFields.error)
                return null
                }

           } 


            //職員用戶登入
            
                const login_form_validatedFields = staffUser_Login_Schema.safeParse(credentials);
                if (login_form_validatedFields.success) {
                const { username , password } = login_form_validatedFields.data;
                //用戶檢查
                const user = await getStaffUserByUserName(username);
                //username / password 錯會
                if (!user || !user.password) return console.error("no user or no pw (staff)");
                //PW解碼
                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password,
                );
                //PW ＆＆　username 沒問題　在DB 最user 資料
                    if(passwordsMatch) return user

               
                } else {
                //輸入form 錯誤
                console.error("form have wrong (staff) : ",login_form_validatedFields.error)
                return null
                }


            // else {}

              

            
        }
    }),
],
} satisfies NextAuthConfig
