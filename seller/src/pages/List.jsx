import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token, setSellerId }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    if (!token) return toast.error("Not authorized. Please login again.");

    try {
      const response = await axios.get(`${backendUrl}/api/product/adminlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.products.length > 0) {
        setSellerId(response.data.products[0].sellerId); // set sellerId for App state
        setList(response.data.products);
      } else {
        toast.error("No products found");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4">
                    <img
                      className="h-26 object-cover rounded-md"
                      src={item.image[0]}
                      alt={item.name}
                    />
                  </td>
                  <td className="py-2 px-4 font-medium">{item.name}</td>
                  <td className="py-2 px-4">{item.category}</td>
                  <td className="py-2 px-4 font-semibold">{currency}{item.price}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
