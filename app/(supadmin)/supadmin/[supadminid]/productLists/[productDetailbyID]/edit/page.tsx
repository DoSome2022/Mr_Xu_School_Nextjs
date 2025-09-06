"use client";


import Product_Update_Formbysupadmin from "@/components/CreateForm/SUPADMIN/UpdateForm/Sup-Product-Update-Form";

const ProductDetailEditbysupadmin = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">編輯商品</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
          <Product_Update_Formbysupadmin />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailEditbysupadmin;