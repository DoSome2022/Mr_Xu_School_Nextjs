This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


14-7-2025 
正當在 ROLE supadmin 中的在建立 timetemplateLists的東西時，發現全部有關supadmin 的path 都有錯，已經修改了
期閒發現了很多bug 
在15-7-2025時修改

23-7-2025
已經完成了supadmin的用戶列表中的家長path修改

- 接下來做supadmin的用戶列表中的老師path修改及建立
- supadmin的用戶列表中的家長中的學生upload form 要轉supadmin (client side 及 server side)


24-7-2025

完成了supadmin的用戶列表中的家長中的學生upload form 要轉supadmin (client side 及 server side)

接下來要用改變UI 并試supadmin的function 及 mail function


30-7-2025

明天要看看為何tailwindcss 無法使用,最壞情况重寫


12－8－2025

admin 的老師帳單 －未做
admin 修改學校修改資料 －未做
應該有關錢銀 －未做

做了admin UserLists中 adminLists teacherLists 及 parentsLists (但未做student)

admin中 userLists patentLists中的student edit －未做

13 -08-2025

在admin TimeTemplate_Create_Form 發現了bug （一堆紅線） 會向schema TS 這兩方向下手

admin 版面的css 完成（希望run build 時 不會有太多Error有關app）

修改了 
當Role 是ADMIN login 成功後，會轉向 /admin
當Role 是SUPADMIN login 成功後，會轉向 /supadmin/{supadminid}
當Role 是Teacher login 成功後，會轉向 /teacher/{teacherId}
當Role 是PARENT login 成功後，會轉向 /parent/{parentId}

現在修改老師頁面的CSS
老師頁面CSS 好像很久之前做了，但是老師的課程列表 － 沒有做 


User/Parent 

的CSS 還沒有做
子女課堂 － 沒有做
商店 － 沒有做


16-08-2025
商店不能顯示物件 user(Parent)
最後修改完成 是api 錯誤
在商品細節沒法顯示 user(Parent)
最後修改完成 是api 錯誤


在applylists 有顯示的錯誤

18-08-2025

今天只完成3件事

在ADMIN的月歷上的課程加入顯示／不顯示,為了在其他ROLE上的月歷不會顯示已不顯示的課程（第—步看DB有沒有這個field)
login上有問題，在staff login中沒有進行staff 跟 admin 上的選擇（不知是client side 開始 沒有理，還是server side 開始)
admin login 後 http://localhost:3000/unauthorized 這個頁面會出現 is http://localhost:3000/admin

幫supadmin 加入tailwind css 
最後立即進行 run build, 進行del bug

建立course DATA 後 在classroom DB中沒有對應新增DATA


19-08-2025

19-08-2025

已經把login問題解決
1 .server side function 沒有理會client side 管理員 及 職員
2 . admin 登入後的login path bug 修改

3 . 加入了 加入一個按捏是 忘記密碼 ，接完之後出現一個頁面，只有兩行（一行是輸入電子郵件，另一行是輸入username 用來與DB來配對，如果正確就可以改密碼） 及一個按捏（提交） 及一個返回

當用戶輸入了電子郵件及username後，按提交 首先與DB配對是否存在這username（如果不存生就出ERROR 說沒有username 不能send mail） 之後,（有username）就可以照用戶所輸入的電子郵件 發出 個網頁是用來重新建立password 把新PW代替原本的PW 之後按提交 用戶所輸入的新PW 代替原本的PW

最後在User_login.tsx添加一個「忘記密碼」,按鈕router.push 導向 /forgot-password 頁面。

創建忘記密碼頁面（/forgot-password）
創建一個新頁面 app/forgot-password/page.tsx，包含輸入電子郵件和用戶名稱的表單，以及「提交」和「返回」按鈕。

創建重置密碼頁面（/reset-password）
創建一個新頁面 app/reset-password/page.tsx，允許用戶輸入新密碼並提交。

之後開了ForgotPassword 及 ResetPassword的server action
兩這都加入了 index.ts 及 schema.ts

之後在創建 lib/tokens.ts 來處理密碼重置 token 的生成和驗證。
創建 lib/mail.ts 使用郵件服務（例如 Resend）發送重置密碼電子郵件。

在 Prisma 資料庫包含 PasswordResetToken 模型，用於存儲密碼重置 token。

model User {
  id                     String               @id @default(cuid())
  username               String?              @unique
  nickname               String
  email                  String
  phone                  String
  password               String
  role                   UserRole             @default(PARENT)
  account                Account[]
  parent_message_id      String?
  parent_price_record_id String?
  done                   Boolean              @default(false)
  ISNEW                  Boolean              @default(false)
  Student                Student[]
  Message                Message[]
  Price_record           Price_record[]
  PasswordResetToken     PasswordResetToken[] @relation("UserToPasswordResetToken")
  createdAt              DateTime             @default(now())
  updatedAt              DateTime             @updatedAt
}

model PasswordResetToken {
  id        String   @id @default(uuid())
  userId    String
  email     String
  token     String   @unique
  expires   DateTime
  user      User     @relation("UserToPasswordResetToken", fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
在middleware.ts
加入/forgot-password 和 /reset-password 是公開路由，無需登錄即可訪問。

用resend 來做sendmail





22-08-2025

在supadmin做了部分tailwindcss 應要三天時間完成



25-08-2025

現在差 supadmin 的 家長中的學生修改 未做
課程列表  末做
ReceiptLists中的createvoid 末做


27-08-2025

supadmin 的 家長中的學生修改只是簡單地建立了client side 及 server action server side function ，但未能運作

課程列表 想法簡單地做css


2-9-2025

建立成績學校client side (components/CreateForm/Score-Create-Form.tsx)有bug 新加入school_id 及 school



04-9-2025

admin 版本 主頁 顯示 隱藏 有錯 應該當用戶選完課程後 再按隱藏 在下面列表中的課程會消失，而在選項欄中的課程不要消失，但現在消失了（因為應該跟D DB中的ISHOW值）
可有優化位（加入搜索功能 課程）

28/9/2025

經過兩天日子，把supadmin 及 admin 大部分的功能慢慢試下，都解決了bug(在loacl) 接下來在deploy 下測試



admin
BookList-Create-Form.tsx


在各api 加了
// 強制動態渲染，等同於每個 fetch 使用 no-store 和 revalidate: 0
// 強制禁用所有 fetch 快取
// 設定重新驗證時間為 0 秒，確保每次請求動態執行