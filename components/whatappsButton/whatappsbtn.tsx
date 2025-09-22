"use client";



import { useState } from "react";

const WhatsAppButton = ({ whatappmessage }: any) => {
  console.log("whatappmessage :", whatappmessage);
  const phoneNumber = whatappmessage;

//   const [isSend, setIsSend] = useState(whatappmessage.isSend); // 本地狀態追踪 isSend

  console.log("phoneNumber :", phoneNumber,);

  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

  const handleClick = async () => {
    try {

      window.open(whatsappLink, "_blank", "noopener,noreferrer"); // 打開 WhatsApp 連結
    } catch (error) {
      console.error("更新 WhatsApp 狀態失敗:", error);
      alert("發送失敗，請稍後再試！");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`font-bold py-2 px-4 rounded ${
        "bg-green-500 hover:bg-green-600 text-white"
      }`}

    >
      WhatsApp
    </button>
  );
};

export default WhatsAppButton;