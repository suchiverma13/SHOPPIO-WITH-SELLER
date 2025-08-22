import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        let allItems = [];
        res.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allItems.push({
              ...item,
              status: order.status,
              cancelRequested: order.cancelRequested,
              returnRequested: order.returnRequested,
              cancelApproved: order.cancelApproved,
              returnApproved: order.returnApproved,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
            });
          });
        });
        setOrders(allItems.reverse());
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders.");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Cancel request sent");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, cancelRequested: true }
              : order
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleReturn = async (orderId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/return`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Return request sent");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, returnRequested: true }
              : order
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "order placed":
        return "bg-blue-500";
      case "packing":
        return "bg-orange-500";
      case "shipped":
        return "bg-purple-500";
      case "out for delivery":
        return "bg-yellow-500";
      case "delivered":
        return "bg-green-500";
      case "canceled":
        return "bg-red-500";
      case "return requested":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <Title text1="MY" text2="ORDERS" />
      <div className="mt-6 flex flex-col gap-4 sm:gap-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          orders.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300 bg-white"
            >
              {/* Left: Image & Details */}
              <div className="flex w-full sm:w-1/2 gap-4 sm:gap-6">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="h-24 sm:h-28 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 flex flex-col">
                  <p className="font-semibold text-base sm:text-lg break-words">{item.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-gray-700 text-sm sm:text-base">
                    <span>
                      {currency}
                      {item.price}
                    </span>
                    <span>Qty: {item.quantity}</span>
                    <span>Size: {item.size}</span>
                  </div>
                  <p className="mt-1 text-gray-500 text-sm sm:text-base">
                    Date: {new Date(item.date).toDateString()}
                  </p>
                  <p className="mt-1 text-gray-500 text-sm sm:text-base">
                    Payment: {item.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}
                  ></span>
                  <p className="capitalize text-sm sm:text-base break-words">{item.status}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!item.cancelRequested &&
                    !item.cancelApproved &&
                    !item.returnRequested &&
                    item.status.toLowerCase() !== "delivered" && (
                      <button
                        onClick={() => handleCancel(item.orderId)}
                        className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    )}
                  {!item.returnRequested &&
                    !item.returnApproved &&
                    item.status.toLowerCase() === "delivered" && (
                      <button
                        onClick={() => handleReturn(item.orderId)}
                        className="bg-yellow-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 text-sm sm:text-base"
                      >
                        Return
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
