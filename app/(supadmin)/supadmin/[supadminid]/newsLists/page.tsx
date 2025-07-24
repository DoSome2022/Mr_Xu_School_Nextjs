"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const newsListsbysupadmin = () =>{

    const param = useParams();
    console.log("param :",  param ,"--end --"  )
    const supadminid = param?.supadminid as string;
    console.log("supadminid :", supadminid);

    //為了拿 公告 data
    const [ GetNewsData , setgetNewsData ] = useState([]);

    const [ searchQuery , setSearchQuery ] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [ searchField , setSearchField ] = useState("all");


    //拿公告data
    useEffect(() => {
        const fetchnewsData = async () =>{
            //在app/api/Ｎews_Lists/route.ts
            const res = await fetch('/api/News_Lists');
            if(!res){
                throw new Error("斷線！")
            }
            
           const result = await res.json()

           setgetNewsData(result)

        }
        fetchnewsData()
    },[])


    const handleSearch =  async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
          const response = await fetch(`/api/News_Lists_search?query=${searchQuery}&field=${searchField}`);
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("搜尋失敗:", error)
        }
      };


    return(
        <>          
        <Link className="text-stone-950 hover:text-gray-700" href={`/admin/${supadminid}/newsLists/createNews`}>
            建立公告
        </Link>
            <span>newsLists</span>

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
                                  <option value="title">標題</option>
                                  <option value="content">內容</option>
                                  <option value="date">日期</option>

                                </select>

                          <Button onClick={handleSearch} > 搜索 </Button>
                        </div>
                        <p>結果</p>
                        {searchResults?.map((N:any)=>{
                      return(
                        
                        <div  >
                        
                        <div key={N.id} >
                        <Link href={`/supadmin/newsLists/${N.id}`}>
                        模組 : {N.title}, 
                        內容 : {N.content}, 
                        日期 : {N.date}, 
 

                           </Link>

                        </div>
                        </div>

                      )
                    })}
        <br />


            {
                GetNewsData.map((data) => {
                    return(
                        
                        <>
                            <Link className="text-stone-950 hover:text-gray-700" href={`/admin/${supadminid}/newsLists/${data.id}`}>
                                <br />
                                標題: {data.title}
                                <br />
                                內容: {data.content}
                                <br />
                                日期: {data.date}
                                <br />
                            </Link>
                        </>
                    )
                })


            }


        </>
    )
}

export default newsListsbysupadmin