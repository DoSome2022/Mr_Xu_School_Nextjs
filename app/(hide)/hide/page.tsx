// "use client"

// import { useSession } from 'next-auth/react'; 

// const hidepage = () => {
//     const session = useSession();
    
//     // console.log(session?.data?.user)

//     const userdata = session?.data?.user 

//     if(userdata.staff === true && userdata.isadmin === true){
//     return(
//         <>
//             <span>hidepage</span>
//         <br />
//             是admin

//         </>
//     )  
//     }

//     if(userdata.staff === true && userdata.isadmin === false){
//         return(
//             <>
//                 是老師　職員
//             </>
//         )

//     }

//     if(userdata.staff === false && userdata.isadmin === false){
//         return(
//             <>
//                 甚麼都不是
//             </>
//         )
//     }

// }

// export default hidepage

"use client";

import { useSession } from "next-auth/react";

const HidePage = () => {
  const { data: session, status } = useSession();

  // 處理載入狀態
  if (status === "loading") {
    return <div>載入中...</div>;
  }

  // 處理未登錄狀態
  if (status === "unauthenticated" || !session?.user) {
    return <div>請先登錄</div>;
  }

  const userdata = session.user;

  if (userdata.staff === true && userdata.isAdmin === true) {
    return (
      <>
        <span>hidepage</span>
        <br />
        是管理員
      </>
    );
  }

  if (userdata.staff === true && userdata.isAdmin === false) {
    return (
      <>
        是老師或職員
      </>
    );
  }

  if (userdata.staff === false && userdata.isAdmin === false) {
    return (
      <>
        甚麼都不是
      </>
    );
  }

  // 預設返回，處理未預期的 user 狀態
  return <div>無效的用戶狀態</div>;
};

export default HidePage;