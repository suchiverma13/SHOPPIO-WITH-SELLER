import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const Product = () => {
  const { isSignedIn } = useAuth();
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  if (!productData)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
// Add to Cart
const handleAddToCart = () => {
if (!isSignedIn) {
  navigate("/login", { state: { from: window.location.pathname } });
  return;
}

  if (!size) {
    toast.error("Please select a size", { autoClose: 2000 });
    return;
  }
  addToCart(productData._id, size);
  toast.success("Item added to cart!", { autoClose: 2000 });
};

// Buy Now
const handleBuyNow = () => {
  if (!isSignedIn) {
  navigate("/login", { state: { from: window.location.pathname } });
  return;
}

  if (!size) {
    toast.error("Please select a size");
    return;
  }
  navigate("/place-order", { state: { product: productData, size } });
};


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Images */}
        <div className="flex flex-1 flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-1/5">
            {productData.image.map((item, idx) => (
              <img
                key={idx}
                src={item}
                onClick={() => setImage(item)}
                className={`w-20 h-20 object-cover border cursor-pointer ${
                  image === item ? "border-black" : "border-gray-200"
                }`}
                alt="thumbnail"
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                  className="w-5 h-5"
                />
              ))}
            <span className="ml-2 text-gray-500">(122)</span>
          </div>

          <p className="text-3xl font-bold mt-3">
            {currency}
            {productData.price}
          </p>

          <p className="text-gray-600 mt-3">{productData.description}</p>

          {/* Sizes */}
          <div className="mt-6">
            <p className="mb-2 font-medium">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 border cursor-pointer rounded-md transition-all duration-200 hover:border-orange-500 ${
                    s === size
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                handleAddToCart();
              
              }}
              className="bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-orange-500 text-white py-3 px-8 rounded-md hover:bg-orange-600 transition-colors"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-8 text-gray-500 text-sm flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Cash on delivery available</p>
            <p>Easy returns within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description & Related */}
      <div className="mt-16">
        <div className="flex border-b">
          <button className="px-6 py-3 font-medium text-gray-700 border-b-2 border-orange-500">
            Description
          </button>
          <button className="px-6 py-3 text-gray-500">Reviews (122)</button>
        </div>
        <div className="mt-6 text-gray-600 space-y-4">
          <p>{productData.description}</p>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
