"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const schoolListsbysupadmin = () => {
        const param = useParams();
        console.log("param :",  param ,"--end --"  )
        const supadminid = param?.supadminid as string;
        console.log("supadminid :", supadminid);


        //為了拿 school data
        const [ GetSchoolsData , setgetSchoolsData ] = useState([]);

        const [ searchQuery , setSearchQuery ] = useState("");
        const [searchResults, setSearchResults] = useState([]);
        const [ searchField , setSearchField ] = useState("all");

        //拿 school data
        useEffect(() => {
            const fetchschoolsData = async () =>{
                //在app/api/Ｎews_Lists/route.ts
                const res = await fetch('/api/School_Lists');
                if(!res){
                    throw new Error("斷線！")
                }
                
               const result = await res.json()
    
               setgetSchoolsData(result)
    
            }
            fetchschoolsData()
        },[])
    
        const handleSearch =  async (event: React.ChangeEvent<HTMLInputElement>) => {
            try {
              const response = await fetch(`/api/SchoolLists_search?query=${searchQuery}&field=${searchField}`);
              const data = await response.json();
              setSearchResults(data);
            } catch (error) {
              console.error("搜尋失敗:", error)
            }
          };
    
    



    return(
        <>
            <span>
                <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/createschool`}>
                    建立學校
                </Link>
                <br />
                

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
                                  <option value="school_name">學校列表</option>

                                </select>

                          <Button onClick={handleSearch} > 搜索 </Button>
                        </div>
                        <p>結果</p>
                        {searchResults?.map((s:any)=>{
                      return(
                        
                        <div  >
                        
                        <div key={s.id} >
                        學校 : {s.school_name}, 


                           

                        </div>
                        </div>

                      )
                    })}
        <br />

                <span>學校列表</span>
               
                {
                    GetSchoolsData.map((data: any)=>{
                        return(
                        <>
                <div className="bg-slate-100" key={data.id}>

                            <Link className="text-stone-950 hover:text-gray-700" href={`/supadmin/${supadminid}/schoolLists/${data.id}`}>
                                <br />
                                學校: {data.school_name}
                            </Link>
                </div>

                        </>
                        )
                    })
                }

                
            </span>

        </>
    )
}

export default schoolListsbysupadmin