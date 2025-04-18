"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { useEffect, useState } from "react";

const gradeMapping = {
    1: "小學1年級",
    2: "小學2年級",
    3: "小學3年級",
    4: "小學4年級",
    5: "小學5年級",
    6: "小學6年級",
    7: "初中1年級",
    8: "初中2年級",
    9: "初中3年級",
    10: "高中1年級",
    11: "高中2年級",
    12: "高中3年級",
  };




const CourseLists = () => {
    //為了拿課程data
    const [ GetCourseData , setgetCourseData ] = useState([]);

    const [ searchQuery , setSearchQuery ] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [ searchField , setSearchField ] = useState("all");

    //拿課程data
    useEffect(() => {
        const getTeacherData = async () =>{
            //在app/api/Course_data/route.ts
            const res = await fetch('/api/Course_Lists');
            if(!res){
                throw new Error("斷線！")
            }
            
           const result = await res.json()

           setgetCourseData(result)

        }
        getTeacherData()
    },[])
    // console.log(" Course Data : ", GetCourseData ,"-- end --")

    const handleSearch =  async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
          const response = await fetch(`/api/Course_Lists_search?query=${searchQuery}&field=${searchField}`);
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("搜尋失敗:", error)
        }
      };

    return(
        <>
        <span>
            <Link className="text-stone-950 hover:text-gray-700" href={"/admin/courseLists/createCourse"}>
            建立課程
            </Link>

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
                                  <option value="course_name">標題</option>
                                  <option value="course_subject">科目</option>
                                  <option value="persons">人數</option>
                                 
                                  <option value="teacher">老師</option>
                                  <option value="grade">年級</option>

                                </select>

                          <Button onClick={handleSearch} > 搜索 </Button>
                        </div>
                        <p>結果</p>
                        {searchResults?.map((C:any)=>{
                      return(
                        
                        <div  >
                        
                        <div key={C.id} >
                        <Link href={`/admin/courseLists/${C.id}`}>
                        課程名稱/課程ID: {C.course_name} <br />
                        科目: {C.course_subject} <br />
                        人數: {C.persons} <br />

                        老師: {C.teacher} <br />
                        年級: {C.grade} <br />


                           </Link>

                        </div>
                        </div>

                      )
                    })}
        <br />

            <div className="bg-slate-100" >
            {
                GetCourseData.map((data:any)=>{
                    return(
                        <>
                            <Link className="text-stone-950 hover:text-gray-700" href={`/admin/courseLists/${data.id}`}>
                            課程名稱/課程ID: {data.course_name}
                            {/* <br />
                            課程科目: {data.course_subject}
                            <br />
                            人數: {data.persons}
                            <br />
                            年級: {gradeMapping[ data.grade ]}
                            <br /> */}
                            <br />
                            </Link>
                        </>
                    )
                })
            }
            
            </div>
        </span>
        </>
    )
}

export default CourseLists