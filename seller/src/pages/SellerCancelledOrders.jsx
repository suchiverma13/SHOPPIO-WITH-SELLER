import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App"; // agar App.js me export kiya hai
import { toast } from "react-toastify";

const SellerCancelledOrders = ({ sellerId, token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all orders with canceled/return status
  const fetchCancelledOrders = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        let AdminOrders = response.data.orders
          .reverse()
          .map((order) => {
            const filteredItems = order.items.filter(
              (item) => item.sellerId === sellerId
            );
            return { ...order, items: filteredItems };
          })
          .filter((order) => order.items.length > 0);

        // Filter orders where status is Canceled or Return Requested/Approved
        AdminOrders = response.data.orders.filter((order) =>
          ["Canceled", "Return Requested", "Return Approved"].includes(
            order.status
          )
        );
        setOrders(AdminOrders.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve cancel or return
  const approveAction = async (orderId, actionType) => {
    setUpdatingId(orderId);
    try {
      const status = actionType === "cancel" ? "Canceled" : "Return Approved";

      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(
          `${actionType === "cancel" ? "Cancel" : "Return"} approved`
        );
        fetchCancelledOrders();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchCancelledOrders();
  }, [token]);

  if (loading) return <p className="text-gray-600 p-4">Loading orders...</p>;
  if (orders.length === 0)
    return (
      <p className="text-gray-600 p-4">No canceled or return orders found.</p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Cancelled / Return Orders
      </h3>

      <div className="space-y-4">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <p className="text-gray-800 font-medium">Order ID: {order._id}</p>
              <p>
                Status: <span className="font-semibold">{order.status}</span>
              </p>
              <p>
                Amount:{" "}
                <span className="font-bold">
                  {currency}
                  {order.amount?.toLocaleString("en-IN")}
                </span>
              </p>
              <p>Items: {order.items.map((item) => item.name).join(", ")}</p>
              <p>
                User: {order.address?.firstName} {order.address?.lastName}
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex flex-col gap-2">
              {(order.status === "Return Requested" ||
                order.status === "Canceled") && (
                <button
                  disabled={updatingId === order._id}
                  onClick={() =>
                    approveAction(
                      order._id,
                      order.status === "Canceled" ? "cancel" : "return"
                    )
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Approve {order.status === "Canceled" ? "Cancel" : "Return"}
                </button>
              )}
              <p className="text-sm text-gray-500">
                {order.date ? new Date(order.date).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerCancelledOrders;
