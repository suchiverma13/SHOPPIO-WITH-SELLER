import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("salePrice", salePrice);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName(""); setDescription(""); setPrice(""); setSalePrice(""); setQuantity("");
        setImage1(false); setImage2(false); setImage3(false); setImage4(false);
        setSizes([]); setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Add New Product</h2>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">

        {/* Image Upload */}
        <div>
          <p className="font-semibold mb-2 text-gray-700">Upload Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[image1, image2, image3, image4].map((img, index) => (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                className="relative border border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer h-28 overflow-hidden hover:border-blue-400 transition"
              >
                <img
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt="Upload"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                  onChange={(e) => {
                    const setter = [setImage1, setImage2, setImage3, setImage4][index];
                    setter(e.target.files[0]);
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Price</label>
            <input
              type="number"
              placeholder="25"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>
          <div>
            <label className="font-medium text-gray-700">Sub Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              placeholder="10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Sale Price</label>
            <input
              type="number"
              placeholder="20"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="font-medium text-gray-700 mb-2">Sizes</p>
          <div className="flex gap-3 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-1 rounded-xl border transition ${
                  sizes.includes(size)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller((prev) => !prev)}
            className="w-4 h-4 accent-blue-500"
          />
          <label htmlFor="bestseller" className="text-gray-700 font-medium cursor-pointer">
            Add to Bestseller
          </label>
        </div>

        <button
          type="submit"
          className="w-full sm:w-40 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
