import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ totalAmount }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  // Agar prop mila hai to usko use karo, warna context ka calculation
  const finalAmount =
    totalAmount !== undefined ? totalAmount : getCartAmount() + delivery_fee;

  const subtotal =
    totalAmount !== undefined
      ? totalAmount - delivery_fee
      : getCartAmount();

  return (
    <div className="w-full">
      <div className="text-2xl ">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between ">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency} {finalAmount}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
