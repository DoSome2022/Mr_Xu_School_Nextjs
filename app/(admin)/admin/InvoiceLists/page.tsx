"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface InvoiceData {
  id:string;
  title:string;
  content: string;
  price: number;
  servetype: string;
}

const InvoiceListsPage = () => {

  const [GetInvoiceData , setGetInvoiceData] = useState<InvoiceData[]>([]);

  useEffect(()=>{
    const GetInvoiceData = async () => {
      const res = await fetch('/api/Invoice_Lists');
      if(!res){
        throw new Error("斷線！")
      }
      const result = await res.json()
      setGetInvoiceData(result)
    }
    GetInvoiceData()
  },[])

  console.log("GetInvoiceData : ",GetInvoiceData,"-- End --")

  return (
    <>
    <div>
    <Link href={"/admin/InvoiceLists/createInvoice"}>
      Create Invoice
    </Link>
    </div>    
    
    <div>
      <h1>InvoiceListsPage</h1>
        <br />
          {GetInvoiceData.map((d)=>{
            return (
              <div key={d.id}>
                <Link href={`/admin/InvoiceLists/${d.id}`}>
                  Title: {d.title}
                  <br />
                  服務類型: {d.servetype}
                </Link>
              </div>
            )
          })}
        <br />
    </div>
    </>
  );
};

export default InvoiceListsPage;