"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";

const fetcher = (...args) => fetch(...args).then((res) => res.json());


const BookLists_years = () => {

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;

    console.log(SchoolId);
    
const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolyears/' , fetcher);

if(error) return <> error : {error} </>
if(isLoading) return <> 載入中 .... </>

return(
    <>
            <span> BookLists_years </span>
                    <br />
                    <Link className="text-stone-950 hover:text-gray-700"  
                        href={`/admin/schoolLists/${SchoolId}/bookLists/upload`}
                    >
                        上傳書單
                    </Link>
                    <br />
        
            {data.map((year) =>{
                return(
                    <>

                    <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/admin/schoolLists/${SchoolId}/bookLists/${year.school_year}`}
                        >
            
                        年份 : {year.school_year}
                        
                        </Link>
                        

                    <br />
                    </>
                )
            })}    




        </>
    )
}

export default BookLists_years