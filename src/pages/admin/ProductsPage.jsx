import React, { useState } from "react";

const ProductsPage = () => {
  // Static product data
  const productList = [
    { name: "Bluetooth Devices", price: "$10", totalOrder: "34,666", totalSales: "$3,46,660" },
    { name: "Arefot", price: "$10", totalOrder: "NaN", totalSales: "NaN" },
    { name: "Bluetooth Devices", price: "$10", totalOrder: "34,666 Piece", totalSales: "$3,46,660" },
    { name: "Shoes", price: "$10", totalOrder: "34,666 Piece", totalSales: "$3,46,660" },
  ];

  // Monthly data
  const monthlyData = [
    { month: "Jan", value: "23,400" },
    { month: "Feb", value: "15,000" },
    { month: "Mar", value: "30,000" },
    { month: "Apr", value: "22,000" },
    { month: "May", value: "10,000" },
    { month: "Jun", value: "23,400" },
    { month: "Jul", value: "5,000" },
  ];

  // Sales analytics data for circular progress
  const salesAnalytics = [
    { label: "Total Sales", value: 50, color: "blue" },
    { label: "Total Order", value: 30, color: "yellow" },
    { label: "Order Cancel", value: 20, color: "red" },
  ];

  // State for slider
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  // Handlers
  const handleAddProduct = () => {
    setIsSliderOpen(true);
  };

  const handleSave = () => {
    console.log("Saving:", { productName, price, images });
    setIsSliderOpen(false);
    setProductName("");
    setPrice("");
    setImages([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header with Add Product Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Products List</h1>
          <p className="text-gray-500 text-sm">Manage your products inventory</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary transition-colors duration-200 flex items-center"
          onClick={handleAddProduct}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Main Content with Table and Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product List Table */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 w-full lg:w-2/3">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productList.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalOrder}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          {/* Monthly Data */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Product Add by Month</h2>
            <div className="space-y-4">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-16 text-gray-600 font-medium">{item.month}</span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index % 2 === 0 ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-blue-600"
                      }`}
                      style={{ width: `${(parseInt(item.value.replace(/,/g, "")) / 30000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-20 text-right text-sm text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics with Circular Progress Bar */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Product Sales Analytics</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="3"
                  />
                  {salesAnalytics.map((item, index) => {
                    const offset = 100 - item.value;
                    const startOffset = index === 0 ? 0 : salesAnalytics.slice(0, index).reduce((acc, curr) => acc + curr.value, 0);
                    return (
                      <circle
                        key={index}
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={startOffset + offset}
                        transform="rotate(-90 18 18)"
                        className="transition-all duration-1000"
                      />
                    );
                  })}
                  <text x="18" y="20" textAnchor="middle" fontSize="6" fill="#333" fontWeight="bold">
                    $220
                  </text>
                </svg>
              </div>
              <ul className="w-full space-y-2">
                {salesAnalytics.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className="w-3 h-3 mr-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Right-Side Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-newPrimary">Add New Product</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setIsSliderOpen(false)}
                >
                  &times;
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-newPrimary focus:border-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Price
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Product Images
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-newPrimary hover:text-newPrimary focus-within:outline-none"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              multiple
                              onChange={handleImageUpload}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {images.map((image, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image}
                                alt={`Preview ${idx}`}
                                className="w-full h-32 object-cover rounded-md border border-gray-200"
                              />
                              <button
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(idx)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setIsSliderOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-newPrimary hover:bg-newPrimary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleSave}
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;