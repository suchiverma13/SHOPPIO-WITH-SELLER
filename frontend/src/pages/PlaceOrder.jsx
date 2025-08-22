import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const buyNowProduct = location.state?.product;
  const buyNowSize = location.state?.size;

  const [method, setMethod] = useState("cod");
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order, orderItems) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            items: orderItems,
            address: formData,
            amount:
              buyNowProduct && buyNowSize
                ? buyNowProduct.price + delivery_fee
                : getCartAmount() + delivery_fee,
          };

          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            verifyData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success) {
            toast.success("Payment Successful");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error("Payment Verification Failed");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let orderItems = [];

      // Buy Now flow
      if (buyNowProduct && buyNowSize) {
        orderItems.push({
          ...structuredClone(buyNowProduct),
          size: buyNowSize,
          quantity: 1,
        });
      } else {
        // Cart flow
        for (const itemId in cartItems) {
          for (const size in cartItems[itemId]) {
            if (cartItems[itemId][size] > 0) {
              const itemInfo = structuredClone(
                products.find((p) => p._id === itemId)
              );
              if (itemInfo) {
                itemInfo.size = size;
                itemInfo.quantity = cartItems[itemId][size];
                orderItems.push(itemInfo);
              }
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("No products to place order");
        return;
      }

      const totalAmount =
        buyNowProduct && buyNowSize
          ? buyNowProduct.price + delivery_fee
          : getCartAmount() + delivery_fee;

      const orderData = {
        items: orderItems,
        address: formData,
        amount: totalAmount,
      };

      switch (method) {
        case "cod":
          const responseCOD = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (responseCOD.data.success) {
            toast.success(responseCOD.data.message);
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(responseCOD.data.message);
          }
          break;

        case "razorpay":
          const responseRazorpay = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.razorpayOrder, orderItems);
          } else {
            toast.error("Failed to create Razorpay order");
          }
          break;

        case "stripe":
          toast.info("Stripe payment integration coming soon");
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 min-h-[80vh] border-t px-4 sm:px-6 lg:px-16"
    >
      {/* Left side Form */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        {/* Delivery fields */}
        <div className="flex gap-3">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={formData.firstName}
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={formData.lastName}
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={formData.zipcode}
            type="number"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={formData.phone}
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="mt-8 sm:mt-0 flex-1">
        <div className="mt-8 min-w-80">
          <CartTotal
            totalAmount={
              buyNowProduct && buyNowSize
                ? buyNowProduct.price + delivery_fee
                : getCartAmount() + delivery_fee
            }
          />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row mt-2">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white text-sm px-16 py-3 cursor-pointer rounded-md hover:bg-gray-800 transition-colors"
            >
              PLACE ORDER &gt;
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
