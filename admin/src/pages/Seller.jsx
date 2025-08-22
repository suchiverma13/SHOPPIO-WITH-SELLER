import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Sellers = ({ token }) => {
  const [sellers, setSellers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const fetchSellers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/seller/list`, {
        headers: { token },
      });
      if (res.data.success) setSellers(res.data.sellers);
      else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatus = async (sellerId, action) => {
    setLoadingId(sellerId);
    try {
      if (action === "delete") {
        await axios.delete(`${backendUrl}/api/seller/${sellerId}`, {
          headers: { token },
        });
        toast.success("Seller deleted successfully");
      } else {
        await axios.post(
          `${backendUrl}/api/seller/status`,
          { sellerId, isApproved: action === "approve" },
          { headers: { token } }
        );
        toast.success(action === "approve" ? "Seller approved" : "Seller rejected");
      }
      fetchSellers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="p-6 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
        Seller Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sellers.map((seller) => (
          <div
            key={seller._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 cursor-pointer flex flex-col justify-between"
            onClick={() => setSelectedSeller(seller)}
          >
            <div>
              <p className="text-xl font-semibold text-gray-800">{seller.name}</p>
              <p className="text-gray-500 mt-1">{seller.shopName}</p>

              <span
                className={`inline-block mt-3 px-3 py-1 text-sm font-medium rounded-full ${
                  seller.isApproved
                    ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                    : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                }`}
              >
                {seller.isApproved ? "Approved" : "Pending"}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {!seller.isApproved ? (
                <>
                  <button
                    disabled={loadingId === seller._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatus(seller._id, "approve");
                    }}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
                  >
                    {loadingId === seller._id ? "Updating..." : "Approve"}
                  </button>
                  <button
                    disabled={loadingId === seller._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatus(seller._id, "reject");
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
                  >
                    {loadingId === seller._id ? "Updating..." : "Reject"}
                  </button>
                </>
              ) : (
                <button
                  disabled={loadingId === seller._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatus(seller._id, "delete");
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
                >
                  {loadingId === seller._id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedSeller(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{selectedSeller.name}</h2>
            <p className="mb-2"><span className="font-medium">Shop Name:</span> {selectedSeller.shopName}</p>
            <p className="mb-2"><span className="font-medium">GST:</span> {selectedSeller.gst}</p>
            <p className="mb-2"><span className="font-medium">Email:</span> {selectedSeller.email}</p>
            <p className="mb-2">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-white ${
                  selectedSeller.isApproved
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >
                {selectedSeller.isApproved ? "Approved" : "Pending"}
              </span>
            </p>
            <p className="mb-2"><span className="font-medium">Joined:</span> {new Date(selectedSeller.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sellers;
