interface Product {
    id : string;
    name : string;
    description : string;
    price : string;
}

interface ProductDetailListsProps{
    data : Product
}

//要小心留意　這是傳入來是用[] array包著　所以用.map()來解開　
//最好用console.log 查看　，是否之後都是用[] 包進來
const ProductDetailLists = ({ data } : ProductDetailListsProps) => {
    return(
        <>
            {data.map((d)=>{
                return(
                    <>
                        <br />
                        商品名稱：{d.name}
                        <br />
                        商品詳程：{d.description}

                            <br />
                        商品價錢:{d.price}
                          
                            <br />
                    
                    </>
                )
            })}
        </>
    )
}

export default ProductDetailLists