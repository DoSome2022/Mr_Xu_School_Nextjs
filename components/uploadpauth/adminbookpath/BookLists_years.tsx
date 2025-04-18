"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import BookLists_grade_Links from "./BookLists_grade";




interface BookLists_years_Data{
    school_year: string
}

interface BookLists_years_Links_Props{
    years: BookLists_years_Data
}


const BookLists_years_Links = ({years} : BookLists_years_Links_Props) =>{

const params = useParams();//plz use console.log check params name
const SchoolId = params?.schooldetailbyID as string;// 獲取URL中的SchoolId參數



    
    return(
        <>

            <Link className="text-stone-950 hover:text-gray-700" 
            href={`/admin/schoolLists/${SchoolId}/bookLists/${years.school_year}`}
            >
                {years.school_year}
            </Link>






        </>
    )


}

export default BookLists_years_Links