import React, { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/cart")
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("Hiba a kosár betöltésekor:", err));
  }, []);

  const removeFromCart = (itemId: number) => {
    fetch(`http://localhost:5000/api/cart/${itemId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        } else {
          alert("Hiba a törléskor!");
        }
      })
      .catch((err) => console.error("Hiba a törléskor:", err));
  };

  const clearCart = () => {
    fetch("http://localhost:5000/api/cart", {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setCartItems([]);
        } else {
          alert("Hiba a kosár ürítésekor!");
        }
      })
      .catch((err) => console.error("Hiba a kosár ürítésekor:", err));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kosár</h1>
      <div className="grid grid-cols-1 gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-900 font-semibold">Ár: {item.price} Ft</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Törlés
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={clearCart}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Kosár ürítése
      </button>
    </div>
  );
};

export default Cart;
