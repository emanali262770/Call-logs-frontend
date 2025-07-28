// src/pages/admin/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select'; // Added for multi-select category
import { PuffLoader } from "react-spinners"; 

// Initial state for the edit form
const initialFormState = {
  name: "", price: "", description: "", category: [], // Use array for multi-select
  stock: "", color: "", size: "", promotion: "", 
  discountPercentage: "", // ✅ Add discount field
  images: [],
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  // State for the Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // The complete product object
  const [editFormState, setEditFormState] = useState(initialFormState); // The data in the form fields
  const [editLoading, setEditLoading] = useState(false); // Loading state for the modal submission

  // State for dropdowns
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);

  // ✅ Add state for multi-select categories and conditional promotion field
  const [selectedEditCategories, setSelectedEditCategories] = useState([]); 
  const [selectedEditPromotionName, setSelectedEditPromotionName] = useState("");

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, promoRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/promotions`),
        ]);
        
        setProducts(
          Array.isArray(prodRes.data.data)
            ? prodRes.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            : []
        );
        console.log("Product", products);
        
        setCategories(catRes.data.data.filter(c => c.isEnable));
        setPromotions(promoRes.data.data.filter(p => p.isEnable));
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        toast.error("Failed to fetch initial data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#00c7fc" />
      </div>
    );
  }
  
  // Open the edit modal and populate the form
  const handleEdit = (product) => {
    setEditingProduct(product);

    // Format categories for react-select
    const preselectedCategories = product.category.map(cat => ({
      value: cat._id,
      label: cat.name,
    }));
    setSelectedEditCategories(preselectedCategories);
    
    // Set the name of the current promotion for conditional rendering
    const currentPromotion = promotions.find(p => p._id === product.promotion?._id);
    setSelectedEditPromotionName(currentPromotion?.name || "");

    setEditFormState({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category.map(cat => cat._id), // Store just the IDs
      stock: product.stock || "",
      color: Array.isArray(product.color) ? product.color.join(", ") : "",
      size: Array.isArray(product.size) ? product.size.join(", ") : "",
      promotion: product.promotion?._id || "",
      discountPercentage: product.discountPercentage || "", // ✅ Populate discount
      images: [],
    });
    setShowEditModal(true);
  };

  // Handle changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      if (files.length > 5) {
        toast.error("You can only upload a maximum of 5 new images.");
        return;
      }
      setEditFormState(prev => ({ ...prev, images: Array.from(files) }));
    } else {
      setEditFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handler for multi-select category change in the modal
  const handleEditCategoryChange = (selectedOptions) => {
    setSelectedEditCategories(selectedOptions);
    const categoryIds = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setEditFormState(prev => ({ ...prev, category: categoryIds }));
  };

  // Handler for promotion dropdown change in the modal
  const handleEditPromotionChange = (e) => {
    const promotionId = e.target.value;
    const promotion = promotions.find(p => p._id === promotionId);
    setSelectedEditPromotionName(promotion?.name || "");
    
    setEditFormState(prev => ({
      ...prev,
      promotion: promotionId,
      discountPercentage: promotion?.name === 'Discount' ? prev.discountPercentage : ""
    }));
  };

  // Submit the updated product data
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // --- 1. VALIDATION FIRST ---
    if (Number(editFormState.price) <= 145) {
      toast.error("Price must be greater than 145.");
      return; // Stop here. `editLoading` is still false.
    }

    // --- 2. SET LOADING STATE ---
    setEditLoading(true);
    
    const formData = new FormData();
    Object.keys(editFormState).forEach(key => {
      // ✅ Join the category array into a comma-separated string
      if (key === 'category') {
        formData.append('category', editFormState.category.join(','));
      } else if (key !== 'images') {
        formData.append(key, editFormState[key]);
      }
    });

    if (editFormState.images.length > 0) {
      editFormState.images.forEach(image => {
        formData.append('images', image);
      });
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct._id}`, 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setProducts(products.map(p => p._id === editingProduct._id ? data.data : p));
      toast.success("Product updated successfully!");
      setShowEditModal(false);
      navigate('/admin/products'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product.");
    } finally {
      // --- 3. RESET LOADING STATE ---
      setEditLoading(false);
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        toast.error("Product deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete product.");
      }
    }
  };

  // Add this new handler function
  const handleRemoveImage = async (publicId) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct._id}/images/${publicId}`
        );
        // Update the product state locally to reflect the change immediately
        const updatedProduct = data.data;
        setEditingProduct(updatedProduct); // Update the product being edited
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p)); // Update the main products list
        toast.success("Image removed successfully.");
      } catch (error) {
        toast.error("Failed to remove image.");
      }
    }
  };


  return (
    <>
      <div className="container mx-auto px-4 py-10 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Products Management</h1>
          <Link to='add-product'>
            <button className="text-lg font-semibold px-4 py-2 rounded-md text-white bg-primary hover:bg-blue-700">
              + Add Product
            </button>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded shadow p-6 w-full mx-auto overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Stock</th>
                <th className="py-2 px-4 text-left">Discount</th>
                <th className="py-2 px-4 text-left">Color(s)</th> {/* New Column */}
                <th className="py-2 px-4 text-left">Size(s)</th>  {/* New Column */}
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                [...products]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <img src={product.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 object-cover rounded"/>
                      </td>
                      <td className="py-2 px-4 font-medium">{product.name}</td>
                      <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                      <td className="py-2 px-4">
                        {product.category?.map(cat => cat.name).join(', ') || 'N/A'}
                      </td>
                      <td className="py-2 px-4">{product.stock}</td>
                      <td className="py-2 px-4">
                        {product.discountPercentage > 0 ? (
                          <span className="font-semibold text-red-600">{product.discountPercentage}%</span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      
                      <td className="py-2 px-4">
                        {product.color?.join(', ') || 'N/A'}
                      </td>
                      <td className="py-2 px-4">
                        {product.size?.join(', ') || 'N/A'}
                      </td>
                      <td className="py-2 px-4 space-x-2 text-right">
                        <button onClick={() => handleEdit(product)} className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>
            <form onSubmit={handleUpdateSubmit}>
              {/* Form fields are similar to AddProduct page */}
              {/* Name */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Product Name</label>
                <input type="text" name="name" value={editFormState.name} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              {/* Price */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Price</label>
                <input type="number" name="price" value={editFormState.price} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              {/* Description */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description</label>
                <textarea name="description" value={editFormState.description} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" rows="3" />
              </div>
              {/* Category */}
              {/* Use react-select for multi-category */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Category</label>
                <Select
                  isMulti
                  options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                  value={selectedEditCategories}
                  onChange={handleEditCategoryChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
              {/* Color & Size */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Color (comma-separated)</label>
                <input type="text" name="color" value={editFormState.color} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Size (comma-separated)</label>
                <input type="text" name="size" value={editFormState.size} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              {/* Stock */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Stock</label>
                <input type="number" name="stock" value={editFormState.stock} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              {/* Promotion */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Promotion</label>
                <select
                  name="promotion"
                  value={editFormState.promotion}
                  onChange={handleEditPromotionChange} // ✅ Use the new handler
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">No Promotion</option>
                  {promotions.map(promo => <option key={promo._id} value={promo._id}>{promo.name}</option>)}
                </select>
              </div>
              {/* ✅ Conditionally Render Discount Percentage Field */}
              {selectedEditPromotionName === 'Discount' && (
                <div className="mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <label className="block mb-1 font-medium text-blue-800">Discount Percentage (%)</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={editFormState.discountPercentage}
                    onChange={handleEditFormChange} // Generic handler is fine
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. 10 for 10%"
                    min="1"
                    max="99"
                    required
                  />
                </div>
              )}

              {/* Image Upload */}
              <div className="mb-4 p-4 border rounded">
                <label className="block mb-2 font-medium">Product Images</label>

                {/* Display Current Images with Remove Button */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                  {editingProduct.images && editingProduct.images.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {editingProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image.url} 
                            alt={`Product image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image.public_id)}
                            className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No current images.</p>
                  )}
                </div>

                {/* New Image Upload */}
                <div>
                  <label className="block mb-1 font-medium text-sm">Add New Images</label>
                  <p className="text-xs text-gray-500 mb-2">
                    Adding new images will <span className="font-semibold">append</span> to the existing ones.
                  </p>
                  <input 
                    type="file" 
                    name="images" 
                    accept="image/*" 
                    multiple 
                    onChange={handleEditFormChange} 
                    className="w-full text-sm border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Display names of newly selected files for upload */}
                {editFormState.images.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">New files to add:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {editFormState.images.map((file, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;
