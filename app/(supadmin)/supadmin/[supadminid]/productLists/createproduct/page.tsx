"use client";

import Product_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/Sup-Product-Ceate-Form";

const CreateProductbysupadmin = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">建立商品</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
          <Product_Create_Formbysupadmin />
        </div>
      </div>
    </div>
  );
};

export default CreateProductbysupadmin;