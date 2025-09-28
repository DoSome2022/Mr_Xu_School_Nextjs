// // components/DatasLIsts/NewsDatasLists.tsx
// interface News {
//   id: string;
//   title: string;
//   content: string;
//   date: string;
//   createAt: string; // 包含 Prisma 的 createAt 字段
//   updatedAt: string; // 包含 Prisma 的 updatedAt 字段
// }

// interface NewsDetailListsProps {
//   data: News;
// }

// const NewsDetailLists = ({ data }: NewsDetailListsProps) => {

//     console.log(" new components : ",data ," -- End -- ");

//   return (
//     <div className="space-y-4">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700">標題</h3>
//         <p className="text-gray-800">{data.title}</p>
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700">內容</h3>
//         <p className="text-gray-600">{data.content}</p>
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700">日期</h3>
//         <p className="text-gray-500">{data.date || "無日期"}</p>
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700">創建時間</h3>
//         <p className="text-gray-500">{new Date(data.createAt).toLocaleString()}</p>
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700">更新時間</h3>
//         <p className="text-gray-500">{new Date(data.updatedAt).toLocaleString()}</p>
//       </div>
//     </div>
//   );
// };

// export default NewsDetailLists;


// components/DatasLIsts/NewsDatasLists.tsx
interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: string; // 修正為 createdAt
  updatedAt: string;
}

interface NewsDetailListsProps {
  data: News;
}

const NewsDetailLists = ({ data }: NewsDetailListsProps) => {
  console.log("new components:", data, "-- End --");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">標題</h3>
        <p className="text-gray-800">{data.title}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">內容</h3>
        <p className="text-gray-600">{data.content}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">日期</h3>
        <p className="text-gray-500">{data.date || "無日期"}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">創建時間</h3>
        <p className="text-gray-500">{new Date(data.createdAt).toLocaleString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">更新時間</h3>
        <p className="text-gray-500">{new Date(data.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NewsDetailLists;