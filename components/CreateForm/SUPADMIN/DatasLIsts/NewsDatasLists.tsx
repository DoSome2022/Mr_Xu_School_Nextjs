

// interface News {
//     id : string;
//     title: string;
//     content: string;
//     date: string
// }

// interface NewsDetailListsProps{
//     data : News
// }


// //要小心留意　這是傳入來是用[] array包著　所以用.map()來解開　
// //最好用console.log 查看　，是否之後都是用[] 包進來
// const NewsDetailLists = ({ data } : NewsDetailListsProps) =>{
    
    
//     return(
//         <>
//             {data.map((d)=>{
//                 return(
//                     <>
//                         <br />
//                                 標題: {d.title}
//                                 <br />
//                                 內容: {d.content}
//                                 <br />
//                                 日期: {d.date}
//                                 <br />
                    
//                     </>
//                 )

//             })}



//         </>
//     )
// }

// export default NewsDetailLists


"use client";

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface NewsDetailListsProps {
  data: News[];
}

const NewsDataList = ({ data }: NewsDetailListsProps) => {
  // 檢查數據是否為空
  if (!data || data.length === 0) {
    return <div>暫無新聞數據</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.id} className="border p-4 rounded-md">
          <h3 className="font-bold">標題: {d.title}</h3>
          <p>內容: {d.content}</p>
          <p>日期: {d.date}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsDataList;