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