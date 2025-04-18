"use client";


import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import ProductDetailLists from "@/components/DatasLIsts/ProductDetailList";

const ProductDetail = () => {

    const params = useParams();//plz use console.log see params name
    const ProductId = params?.ProductDetailbyID as string;// 獲取URL中的CourseId參數


    // 為了拿product data by id
    const [GetProductDataById, setGetProductDataById] = useState([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    // 拿product  data by id
    useEffect(() =>{
        if(ProductId) {
            const getProductDetail = async (id: string) => {
                try {
                const res = await fetch(`/api/Product_detail_data_by_id/${id}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetProductDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getProductDetail(ProductId);
        }
    },[ProductId] )


    if (!GetProductDataById) {
        return <div>Loading...</div>;
      }

  


    return (
        <>

{GetProductDataById.map((d: any)=>{
    return(
        <>
        <Link
        href={`/admin/productLists/${d.id}/edit`}
        className="text-2xl font-bold mb-4"
      >
        更改商品
      </Link>


            <span> 商品細節 </span>

            <ProductDetailLists data={GetProductDataById} />
        </>
    )
})}



        </>
    )
}
export default ProductDetail