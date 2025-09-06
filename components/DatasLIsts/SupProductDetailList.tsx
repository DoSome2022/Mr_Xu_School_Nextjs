interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  Course_id: string;
  product_price_record_id: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailListsProps {
  data: Product;
}

const ProductDetailLists = ({ data }: ProductDetailListsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-blue-600">商品名稱</h3>
        <p className="text-gray-800 text-sm">{data.name}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-600">商品描述</h3>
        <p className="text-gray-600 text-sm">{data.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-blue-600">課程 ID</h3>
        <p className="text-gray-600 text-sm">{data.Course_id}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-600">庫存數量</h3>
        <p className="text-gray-600 text-sm">{data.stock}</p>
      </div>
    </div>
  );
};

export default ProductDetailLists;