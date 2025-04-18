"use client"

import AddToCart_Create_Form from "@/components/CreateForm/AddToApplyForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const shops = () => {
  const param = useParams();

  const [getProductsData , setgetProductsData] = useState([]);

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
          {getProductsData?.map((d:any)=>{
            return(
              <>
              <br />
              name:{d.name}
              <br />
              description:{d.description}
              <br />

              <AddToCart_Create_Form  productId={d.id}/>
              </>
            )
          })}
        </>
      );

}

export default shops