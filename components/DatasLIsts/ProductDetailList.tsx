interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface ProductDetailListsProps {
  data: Product;
}

const ProductDetailLists = ({ data }: ProductDetailListsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">商品名稱</h3>
        <p className="text-gray-800">{data.name}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">商品描述</h3>
        <p className="text-gray-600">{data.description}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">商品價格</h3>
        <p className="text-gray-500">{data.price}</p>
      </div>
    </div>
  );
};

export default ProductDetailLists;