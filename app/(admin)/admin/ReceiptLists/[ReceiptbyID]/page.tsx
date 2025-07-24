"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ReceiptByIdPageData {
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
const ReceiptByIdPage = () => {

    const params = useParams();

    console.log("params :  ", params);
    const ReceiptID = params?.ReceiptbyID as string;

    const [GetReceiptByIdData , setGetReceiptByIdData] = useState<ReceiptByIdPageData[]>([])

    useEffect(()=>{
        const fetchReceiptData = async (id:string) => {
            try {
                const response = await fetch(`/api/ReceiptLists_detail_data_by_id/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGetReceiptByIdData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchReceiptData(ReceiptID)
    },[ReceiptID])

    console.log("GetReceiptByIdData : ", GetReceiptByIdData)

    return (
        <div>
            {GetReceiptByIdData.map((d)=>{
                return(
                    <>
                        <br />
                        標題:{d.title}
                        <br />
                        服務類型:{d.servetype}
                        <br />
                        收據編號:{d.Invoice_id}
                        <br />
                        學生名:{d.studentname}
                        <br />
                        價錢:{d.price}
                        <br />
                        付歖方法:{d.PaymentMethods}
                        <br />

                    </>
                )
            })
            }
        </div>
    )
}

export default ReceiptByIdPage