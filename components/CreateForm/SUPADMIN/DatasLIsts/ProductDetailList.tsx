// interface Product {
//     id : string;
//     name : string;
//     description : string;
//     price : string;
// }

// interface ProductDetailListsProps{
//     data : Product
// }

// //要小心留意　這是傳入來是用[] array包著　所以用.map()來解開　
// //最好用console.log 查看　，是否之後都是用[] 包進來
// const ProductDetailLists = ({ data } : ProductDetailListsProps) => {
//     return(
//         <>
//             {data.map((d)=>{
//                 return(
//                     <>
//                         <br />
//                         商品名稱：{d.name}
//                         <br />
//                         商品詳程：{d.description}

//                             <br />
//                         商品價錢:{d.price}
                          
//                             <br />
                    
//                     </>
//                 )
//             })}
//         </>
//     )
// }

// export default ProductDetailLists


"use client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // 如果後端返回 number，改為 number
}

interface ProductDataListProps {
  data: Product[];
}

const ProductDataList = ({ data }: ProductDataListProps) => {
  // 檢查數據是否為空
  if (!data || data.length === 0) {
    return <div>暫無商品數據</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.id} className="border p-4 rounded-md">
          <h3 className="font-bold">商品名稱: {d.name}</h3>
          <p>商品詳情: {d.description}</p>
          <p>商品價格: {d.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductDataList;