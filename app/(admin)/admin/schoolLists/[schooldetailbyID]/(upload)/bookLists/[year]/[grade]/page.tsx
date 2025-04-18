"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

import useSWR from "swr";
//     為了拿 booklists data id/year/grade

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

// const { data , error , isLoading } = useSWR(`http://localhost:3000/api/Booklists_by_id/${SchoolId}/${yearId}/${GradeId.toString()}` , fetcher);


//     為了拿 booklists data id/year/


// const fetcher = (...args) => fetch(...args).then((res) => res.json());

//const { data , error , isLoading } = useSWR(`http://localhost:3000/api/Booklists_by_id/${SchoolId}/${yearId}}` , fetcher);


//     為了拿 booklists data id/


// const fetcher = (...args) => fetch(...args).then((res) => res.json());
// const { data , error , isLoading } = useSWR(`/api/Booklists_by_id/${SchoolId}` , fetcher);



const School_detail_data_by_id_bookLists_year_grade_booklist = () =>{

    const params = useParams<{year: string ; grade: number;}>();//plz use console.log check params name
    const SchoolId = params?.schooldetailbyID as string;// 獲取URL中的SchoolId參數
    const yearId = params?.year as string// 獲取URL中的yearId參數
    const GradeId = params?.grade as number // 獲取URL中的GradeId參數

    
const [ GetBooklistsDataById , setGetBooklistsDataById ] = useState<any>([]);



useEffect(() =>{
    if(SchoolId && yearId && GradeId) {
        const getBooklitsDetail = async (id: string ,yearId:string , GradeId:number) => {
            try {
            const res = await fetch(`/api/Booklists_by_id/${id}/${yearId}/${GradeId}`);
            if(!res.ok) {
                throw new Error("斷線！");
            }
            const result = await res.json();
            setGetBooklistsDataById(result);                    
            } catch (error) {
                console.error(error);
            }
        };
        getBooklitsDetail(SchoolId,yearId,GradeId);
    }
},[SchoolId ,yearId , GradeId] )
    

// http://localhost:3000/admin/schoolLists/cm3iqit0s0001vmfad53rurbc/bookLists/0006-0007/2

// http://localhost:3000/admin/schoolLists/cm3iqit0s0001vmfad53rurbc/bookLists/0006-0007/2


    console.log("-- booklist Data : --",GetBooklistsDataById,"-- end --")







    return(
        <>
            bookLists
        {GetBooklistsDataById.map((d)=>{
            return(
                <>
            <br />
                        <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/admin/schoolLists/${SchoolId}/bookLists/${yearId}/${GradeId}/${d.id}`}
                        >
                            name:{d.name} 
                            <br />

                            
                        
                        </Link>
                    <br />
                    </> 
            )
        })}


       
        </>
    )
}

export default School_detail_data_by_id_bookLists_year_grade_booklist