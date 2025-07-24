"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";


// 定義年級對應對象
const gradeMapping:{[key:string]:string} = {
    "1": "小學1年級",
    "2": "小學2年級",
    "3": "小學3年級",
    "4": "小學4年級",
    "5": "小學5年級",
    "6": "小學6年級",
    "7": "初中1年級",
    "8": "初中2年級",
    "9": "初中3年級",
    "10": "高中1年級",
    "11": "高中2年級",
    "12": "高中3年級",
  };

  interface StudentSchoolGrade{
    school_grade: string
}


const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolGrade[]>  => fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

const ExScopeListsbysupadmin = () =>{

    const params = useParams();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const SchoolId = params?.schooldetailbyID  as String;

    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/` , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
    if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }
    console.log(data)


    return(
        <>

            <span>考試範圍</span>

            <br />
                    <Link className="text-stone-950 hover:text-gray-700"  
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/upload`}
                    >
                        上傳考試卷
                    </Link>
                    <br />


            {data.map((grades) => {
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${grades.school_grade}`}
                >
                {gradeMapping[grades.school_grade]}
                </Link>
            <br />
                    </>
                )
            })}



        </>
    )
}

export default ExScopeListsbysupadmin