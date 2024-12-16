import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Hiba a termékek betöltésekor:", err));
  }, []);

  const addToCart = (productId: number) => {
    fetch(`http://localhost:5000/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Sikeresen hozzáadva a kosárhoz!");
        } else {
          alert("Hiba történt!");
        }
      })
      .catch((err) => console.error("Hiba a kosárhoz adáskor:", err));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Termékek</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-gray-900 font-semibold">
              Ár: {product.price} Ft
            </p>
            <button
              onClick={() => addToCart(product.id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
