"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 

const BookLists_year_grade_by_Id = () => {

    const params = useParams<{year: string ; grade: number; id:string}>();//plz use console.log check params name
    const SchoolId = params?.schooldetailbyID as string;// 獲取URL中的SchoolId參數
    const yearId = params?.year as string// 獲取URL中的yearId參數
    const GradeId = params?.grade as number // 獲取URL中的GradeId參數
    const BookListById = params?.id as string // 獲取URL中的Id參數

    console.log(BookListById)

    const [ GetBooklistsDetailDataById , setGetBooklistsDetailDataById ] = useState<any>([]);


    useEffect(() =>{
        if(SchoolId && yearId && GradeId && BookListById) {
            const getBooklitsDetailById = async (SchoolId: string ,yearId:string , GradeId:Number , BookListById:string) => {
                try {
                const res = await fetch(`/api/Booklists_detail_data_by_id/${SchoolId}/${yearId}/${GradeId}/${BookListById}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetBooklistsDetailDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getBooklitsDetailById(SchoolId,yearId,GradeId,BookListById);
        }
    },[SchoolId ,yearId , GradeId ,BookListById] )


    console.log(GetBooklistsDetailDataById)


    return(
        <>
            {GetBooklistsDetailDataById.map((d)=>{
                return(
                    <>
                    name:{d.name}

                    <br />

                    {
                        d.img && (
                            <Image width={500} height={500} src={d.img} alt="" />
                        )

                    }
                    </>
                )
            })}
        </>
    )
}

export default BookLists_year_grade_by_Id