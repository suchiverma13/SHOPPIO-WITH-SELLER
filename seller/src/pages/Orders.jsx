import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ sellerId, token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAllOrders = async () => {
    if (!token || !sellerId) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const AdminOrders = response.data.orders
          .reverse()
          .map((order) => {
            const filteredItems = order.items.filter(
              (item) => item.sellerId === sellerId
            );
            return { ...order, items: filteredItems };
          })
          .filter((order) => order.items.length > 0);

        setOrders(AdminOrders);
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

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setUpdatingId(orderId);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const approveRequest = async (orderId, type) => {
    setUpdatingId(orderId);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/approve`,
        { orderId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchAllOrders();
      } else {
        toast.error(res.data.message || "Failed to approve request");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "text-blue-500";
      case "Packing":
        return "text-yellow-500";
      case "Shipped":
        return "text-indigo-500";
      case "Out for Delivery":
        return "text-orange-500";
      case "Delivered":
        return "text-green-600 font-semibold";
      case "Canceled":
        return "text-red-600 font-semibold";
      case "Return Approved":
        return "text-green-600 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    if (sellerId) fetchAllOrders();
  }, [sellerId]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Order Management
      </h3>
      {loading && <p className="text-gray-600">Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-600">No orders found.</p>
      )}

      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 rounded-lg p-5 mb-4 bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <img
                src={assets.parcel_icon}
                alt="Parcel"
                className="w-12 h-12 object-contain"
              />
              <div className="space-y-1">
                <p className="text-gray-800 font-medium text-sm sm:text-base">
                  {order.items
                    ?.map(
                      (item) =>
                        `${item.name} x ${item.quantity} ${item.size || ""}`
                    )
                    .join(", ")}
                </p>
                <p className="font-semibold text-gray-700">
                  {order.address?.firstName || ""}{" "}
                  {order.address?.lastName || ""}
                </p>
                <p className="text-gray-500 text-sm">
                  {order.address?.street}, {order.address?.city},{" "}
                  {order.address?.state}, {order.address?.country},{" "}
                  {order.address?.zipcode}
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2 text-gray-700 text-sm">
              <p>
                <span className="font-medium">Items:</span>{" "}
                {order.items?.length || 0}
              </p>
              <p>
                <span className="font-medium">Method:</span>{" "}
                {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.payment ? (
                  <span className="text-green-600 font-semibold">Done</span>
                ) : (
                  <span className="text-red-500 font-semibold">Pending</span>
                )}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {order.date ? new Date(order.date).toLocaleDateString() : "-"}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {currency}
                {order.amount?.toLocaleString("en-IN")}
              </p>
              <p className={`mt-1 ${getStatusColor(order.status)}`}>
                {order.status}
              </p>

              {/* ✅ Return / Cancel Requests */}
              <div className="flex gap-2 mt-2">
                {order.cancelRequested && !order.cancelApproved && (
                  <button
                    disabled={updatingId === order._id}
                    onClick={() => approveRequest(order._id, "cancel")}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Approve Cancel
                  </button>
                )}
                {order.returnRequested && !order.returnApproved && (
                  <button
                    disabled={updatingId === order._id}
                    onClick={() => approveRequest(order._id, "return")}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Approve Return
                  </button>
                )}
              </div>

              {/* ✅ Status Dropdown */}
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
                disabled={updatingId === order._id}
                className="border border-gray-300 rounded-md px-3 py-1 mt-2 text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
                <option value="Return Approved">Return Approved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
