"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductListsbysupadmin = () => {

        const param = useParams();
        console.log("param :",  param ,"--end --"  )
        const supadminid = param?.supadminid as string;
        console.log("supadminid :", supadminid);


        //為了拿 商品 data
        const [ GetProductData , setgetProductData ] = useState([]);

        const [ searchQuery , setSearchQuery ] = useState("");
        const [searchResults, setSearchResults] = useState([]);
        const [ searchField , setSearchField ] = useState("all");

        //拿商品data
        useEffect(() => {
            const fetchproductData = async () =>{
                //在app/api/Product_Lists/route.ts
                const res = await fetch('/api/Product_Lists');
                if(!res){
                    throw new Error("斷線！")
                }
                
               const result = await res.json()
    
               setgetProductData(result)
    
            }
            fetchproductData()
        },[])

        const handleSearch =  async (event: React.ChangeEvent<HTMLInputElement>) => {
            try {
              const response = await fetch(`/api/Product_Lists_search?query=${searchQuery}&field=${searchField}`);
              const data = await response.json();
              setSearchResults(data);
            } catch (error) {
              console.error("搜尋失敗:", error)
            }
          };




    return(
        <>
            <Link className="text-stone-950 hover:text-gray-700" href={"/admin/productLists/createProduct"}>
                    建立商品
                </Link>
            <span> ProductLists </span>

            <br />
        <div className="flex items-center space-x-2">
                          <input 
                            type="text" 
                            placeholder="輸入搜索內容..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                          />
                                <select
                                  value={searchField}
                                  onChange={(e) => setSearchField(e.target.value)}
                                >
                                  <option value="all">所有字段</option>
                                  <option value="name">商品名稱：</option>
                                  <option value="description">商品詳程：</option>
                                  <option value="price">商品價錢</option>

                                </select>

                          <Button onClick={handleSearch} > 搜索 </Button>
                        </div>
                        <p>結果</p>
                        {searchResults?.map((p:any)=>{
                      return(
                        
                        <div  >
                        
                        <div key={p.id} >
                        <Link href={`/admin/${supadminid}/productLists/${p.id}`}>
                        商品名稱 : {p.title}, <br />
                        商品詳程： {p.description} <br />
                        商品價錢：{p.price} <br />


                           </Link>

                        </div>
                        </div>

                      )
                    })}
        <br />


            {
                GetProductData.map((data:any) => {
                    return(
                        <>
                          <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/productLists/${data.id}`}>
                          
                            <br />
                                商品名稱：{data.name}
                            <br />
                                商品詳程：{data.description}

                            <br />
                                商品價錢:{data.price}
                          
                            <br />
                          </Link>  
                        </>
                    )
                })
            }
        
        
        </>
    )
}
export default ProductListsbysupadmin