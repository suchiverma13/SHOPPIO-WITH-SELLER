import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import ProductSkeleton from "./ProductSkeleten";
import { motion } from "framer-motion";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const filtered = products.filter((item) => item.bestseller === true);
    setBestSeller(filtered.slice(0, 5));
    setLoading(false);
  }, [products]);

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="my-16 px-4 sm:px-8">
      <div className="text-center mb-10">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="text-gray-800">BEST</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
            SELLERS
          </span>
        </motion.h2>
        <motion.p
          className="w-full md:w-3/5 mx-auto text-gray-600 text-sm sm:text-base mt-2"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Our top-selling pieces loved by customers. Get them before they're
          gone!
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))
        ) : bestSeller.length > 0 ? (
          bestSeller.map((item) => (
            <motion.div key={item._id} variants={itemVariants}>
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No best sellers found
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default BestSeller;
