"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const studentLists = () => {

  const param = useParams();
  const parentId = param?.parentId as string;
  console.log(parentId);

  const [GetParentDataById , setGetParentDataById] = useState([]);

  useEffect(() => {
      const fetchParentDataById = async (id:string) => {
          try {
              const response = await fetch(`/api/Parents_Lists_by_id/${id}`);
              const data = await response.json();
              setGetParentDataById(data);
          } catch (error) {
              console.error("Error fetching parent data:", error);
          }
      };
      fetchParentDataById(parentId);
  }, [parentId])

  console.log(" GetParentDataById : ",GetParentDataById)

  const studentLists = GetParentDataById[0]?.Student

  

    return (
        <div className="container mx-auto h-full w-full bg-blue-200 p-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-1">

          {studentLists?.map((d:any)=>{
              return(
                <>
                <Link href={`/parent/${parentId}/studentLists/${d.id}/`}>
                
                
                <br />
                name:{d.name}
                <br />
                </Link>
                </>
              )
          })}


          </div>
        </div>
      );

}

export default studentLists