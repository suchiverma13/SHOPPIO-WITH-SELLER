import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
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
        { headers: { token } }
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
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-50 text-gray-700 text-sm uppercase">
              <tr>
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
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-2 px-4">
                      <img
                        className="h-16 sm:w-26 sm:h-26 object-cover rounded-md"
                        src={item.image[0]}
                        alt={item.name}
                      />
                    </td>
                    <td className="py-2 px-4 font-medium text-gray-800">{item.name}</td>
                    <td className="py-2 px-4 text-gray-600">{item.category}</td>
                    <td className="py-2 px-4 font-semibold text-gray-800">
                      {currency}
                      {item.price}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => removeProduct(item._id)}
                        className="bg-red-500 cursor-pointer text-white px-4 py-2 sm:px-3 sm:py-1 rounded-md hover:bg-red-600 transition"
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
    </div>
  );
};

export default List;
