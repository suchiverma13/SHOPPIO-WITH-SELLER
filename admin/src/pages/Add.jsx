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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
        {/* Image Upload Section */}
        <div>
          <p className="mb-2 font-medium">Upload Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[image1, image2, image3, image4].map((img, index) => (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                className="border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden h-28"
              >
                <img
                  className="w-full h-full object-cover"
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt="Upload"
                />
                <input
                  onChange={(e) => {
                    const setter = [setImage1, setImage2, setImage3, setImage4][
                      index
                    ];
                    setter(e.target.files[0]);
                  }}
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="mb-2 font-medium">Product Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full border px-3 py-2 rounded-md"
              type="text"
              placeholder="Type here"
              required
            />
          </div>
          <div>
            <p className="mb-2 font-medium">Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full border px-3 py-2 rounded-md"
              type="number"
              placeholder="25"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="mb-2 font-medium">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border px-3 py-2 rounded-md"
            rows="3"
            placeholder="Write content here"
            required
          />
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="mb-2 font-medium">Product Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className="mb-2 font-medium">Sub Category</p>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottemwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2 font-medium">Product Sizes</p>
          <div className="flex gap-3 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-1 rounded-md border ${
                  sizes.includes(size)
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700"
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
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label htmlFor="bestseller" className="cursor-pointer">
            Add to bestseller
          </label>
        </div>

        <button
          className="w-32 py-3 mt-4 bg-black text-white rounded-md hover:bg-gray-800 transition"
          type="submit"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
