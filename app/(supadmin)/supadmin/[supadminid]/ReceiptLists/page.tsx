"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ReceiptData {
  id: string;
  title: string;
  price: number;
  Invoice_id: string;
  total: number;
  servetype: string;
  studentname: string;
  PaymentMethods:[];
  content:[];
}

interface VoidData {
  title: string;
  price: number;
}

const ReceiptListsPage = () => {

    const param = useParams();
    console.log("param :",  param ,"--end --"  )
    const supadminid = param?.supadminid as string;
    console.log("supadminid :", supadminid);

  const [ GetReceiptData, setGetReceiptData] = useState<ReceiptData[]>([]);
  const [ GetVoidData , setGetVoidData ] = useState<VoidData[]>([]);


  useEffect(()=>{
    const fetchReceiptData = async () =>{
      const res = await fetch('/api/Receipt_Lists');
      if(!res){
        throw new Error("斷線！")
      }
      
      const result = await res.json()

      setGetReceiptData(result)

    }
    fetchReceiptData()

    const fetchVoidData = async () =>{
      const res = await fetch('/api/Void_Lists');
      if(!res){
        throw new Error("斷線！")
      }
      
      const result = await res.json()

      setGetVoidData(result)

    }
    fetchVoidData()


  },[])
  console.log("GetReceiptData : ",GetReceiptData)
  console.log("GetVoidData : ",GetVoidData)
  return (
    <div>
      <h1>ReceiptListsPage</h1>
      <Link  href={`/supadmin/${supadminid}/ReceiptLists/createvoid`}>
      建立補單
      </Link>
      {GetReceiptData.map((d)=>{
        return (
      <Link href={`/supadmin/${supadminid}/ReceiptLists/${d.id}`}>
        <br />
        標題:{d.title}
        <br />
        服務類型:{d.servetype}
        <br />
        學生姓名:{d.studentname}
      </Link>
        )
      })}

      {GetVoidData.map((d)=>{
        return(
          <>
          <br />
          標題:{d.title}
          <br />
          價錢:{d.price}
          <br />
          </>
        )
      })}




    </div>
  );
};

export default ReceiptListsPage;