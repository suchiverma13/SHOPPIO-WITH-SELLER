import { createContext, useState } from "react";

export const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [sellerId, setSellerId] = useState(""); // initially empty string

  return (
    <SellerContext.Provider value={{ sellerId, setSellerId }}>
      {children}
    </SellerContext.Provider>
  );
};
