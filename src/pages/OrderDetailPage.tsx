import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Order #{id}</h2>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;