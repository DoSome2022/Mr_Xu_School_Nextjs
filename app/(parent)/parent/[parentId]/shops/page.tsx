"use client"

import AddToCart_Create_Form from "@/components/CreateForm/AddToApplyForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductData {
  id: string;
  name: string;
  description: string;
  Course_id:string;
}

const shops = () => {
  const param = useParams();

  const [getProductsData , setgetProductsData] = useState<ProductData[]>([]);

  useEffect(()=>{
    const fetchproductsData = async () =>{
      const res = await fetch(`/api/Product_Lists`);
      if(!res){
        throw new Error("斷線！")
      }

      const result = await res.json()
      setgetProductsData(result)
    }
    fetchproductsData()
  },[])

console.log("getProductsData : ",getProductsData)


    return (
        <>
          {getProductsData?.map((d)=>{
            return(
              <>
              <br />
              name:{d.name}
              <br />
              description:{d.description}
              <br />

              <AddToCart_Create_Form  productId={d.id}  productName={d.name}  courseid={d.Course_id}/>
              </>
            )
          })}
        </>
      );

}

export default shops