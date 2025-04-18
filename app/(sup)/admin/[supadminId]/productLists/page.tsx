import Link from "next/link"

const ProductLists = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/productLists/createProduct"}>
            建立商品
        </Link>
            <span> ProductLists </span>
        </>
    )
}
export default ProductLists