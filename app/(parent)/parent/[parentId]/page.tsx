"use client";

import { useEffect, useState } from "react";

const parentByID = () => {
  const [ GetNews , setGetNews ] = useState([]);

  useEffect(() => {
    const fetchnewsData = async () =>{
      const res = await fetch('/api/News_Lists');
      if(!res){
        throw new Error("斷線！")
      }
      const result = await res.json();
      setGetNews(result);
    }
    fetchnewsData();
  },[])

console.log("GetNews : ", GetNews)
    return (
        <div className="container mx-auto h-full w-full bg-blue-200 p-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="col-span-3">
            </div>

            <div className="col-span-2 bg-yellow-100 p-4">
              <p className="text-gray-500 text-lg">公告</p>
              {GetNews.map((d:any)=>{
                return (
                  <div className="bg-white p-4 rounded shadow-md mb-4">
                    <p className="text-gray-800 text-lg">
                      {d.title}
                      <br />
                      {d.content}
                      <br />
                      {d.date}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="col-span-3 flex flex-col sm:flex-row justify-between text-xs text-gray-500 mt-4">
              <p>九龍九龍灣宏光道80號麗晶花園商場1樓105號舖</p>
              <p>Whatsapp: 59190844</p>
              <p>info@target.edu.hk</p>
            </div>
          </div>
        </div>
      );

}

export default parentByID