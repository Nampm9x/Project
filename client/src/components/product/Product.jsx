import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

Modal.setAppElement("#root");

export default function Product({ product, setProducts }) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [modalEditProductIsOpen, setModalEditProductIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentProduct.name,
    thumbnail: currentProduct.thumbnail,
    images: currentProduct.images,
    price: currentProduct.price,
    category: currentProduct.category._id,
    quantity: currentProduct.quantity,
  });
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null);
  const [categories, setCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [whichCategory, setWhichCategory] = useState("");
  const [oldCategory, setOldCategory] = useState("");

  useEffect(() => {
    const fetchOldCategory = async () => {
      try {
        const res = await fetch(
          `/api/category/get-one-child-category/${currentProduct.category}`
        );
        const data = await res.json();
        setOldCategory(data.name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOldCategory();
  }, [currentProduct]);

  const openEditProductModal = () => {
    setModalEditProductIsOpen(true);
  };

  const closeEditProductModal = () => {
    setModalEditProductIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    });
  };

  const handleUploadImage = async () => {
    try {
      if (!file) return;

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, thumbnail: downloadURL });
          });
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/product/edit-product/${currentProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setCurrentProduct(data);
      setModalEditProductIsOpen(false);
      setFormData(currentProduct);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadImages = async () => {
    try {
      if (!files || files.length === 0) return;

      const storage = getStorage(app);

      const uploadPromises = Array.from(files).map((fileImage, index) => {
        const fileName = `${new Date().getTime()}-${index}-${fileImage.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, fileImage);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      });

      const downloadURLs = await Promise.all(uploadPromises);
      setFormData({ ...formData, images: downloadURLs });
    } catch (error) {
      console.log("Error uploading images:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/get-categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleGetChildCategories = async (id) => {
    try {
      const res = await fetch(`/api/category/get-child-categories/${id}`);
      const data = await res.json();
      setChildCategories(data);
      setWhichCategory(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/product/delete-product/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      alert(data.message);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
      alert("Xóa sản phẩm không thành công");
    }
  };
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4 bg-white shadow-md rounded-lg p-4">
      <img
        src={currentProduct.thumbnail}
        alt=""
        className="w-1/12 aspect-square object-cover rounded border"
      />
      <div className="flex-1 w-5/12 text-gray-800 font-medium">
        {currentProduct.name}
      </div>
      <div className="flex-1 w-1/12 text-gray-600 text-center">
        {currentProduct.quantity}
      </div>
      <div className="flex-1 w-2/12 text-gray-600 text-center">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(currentProduct.price)}
      </div>
      <div className="flex-1 w-1/12 text-gray-600 text-center">
        {oldCategory}
      </div>

      <div className="flex gap-2 w-2/12">
        <button
          type="button"
          onClick={() => handleDeleteProduct(currentProduct._id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Xóa
        </button>
        <button
          onClick={openEditProductModal}
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Sửa
        </button>
      </div>

      <Modal
        isOpen={modalEditProductIsOpen}
        onRequestClose={closeEditProductModal}
        className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 z-50 rounded-md bg-white overflow-hidden shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="overflow-y-auto h-[90vh] p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Sửa sản phẩm</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Tên sản phẩm
              </label>
              <input
                id="name"
                onChange={handleChange}
                type="text"
                value={formData.name}
                name="name"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Số lượng
              </label>
              <input
                id="quantity"
                onChange={handleChange}
                type="number"
                value={formData.quantity}
                name="quantity"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700"
              >
                Hình ảnh
              </label>
              <input
                id="thumbnail"
                type="file"
                name="thumbnail"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 mt-1"
              />
              <div className="mt-3">
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail}
                    alt=""
                    className="w-40 h-40 rounded-md object-cover"
                  />
                ) : (
                  <img
                    src={currentProduct.thumbnail}
                    alt=""
                    className="w-40 h-40 rounded-md object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={handleUploadImage}
                className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Tải lên
              </button>
            </div>

            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700"
              >
                Chi tiết sản phẩm
              </label>
              <input
                id="images"
                type="file"
                name="images"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="block w-full text-sm text-gray-500 mt-1"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {(formData.images || currentProduct.images).map(
                  (image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Uploaded ${index}`}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  )
                )}
              </div>
              <button
                type="button"
                onClick={handleUploadImages}
                className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Tải lên
              </button>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Giá
              </label>
              <input
                id="price"
                onChange={handleChange}
                type="number"
                value={formData.price}
                name="price"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="text-sm text-gray-600 mb-2">
                Old category: {oldCategory}
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="border p-2 rounded-md shadow-sm"
                  >
                    <div
                      onClick={() => handleGetChildCategories(category._id)}
                      className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                    >
                      {category.name}
                    </div>
                    {whichCategory === category._id &&
                      childCategories.length > 0 && (
                        <div className="mt-2">
                          {childCategories.map((childCategory) => (
                            <label
                              htmlFor={`category-${childCategory._id}`}
                              key={childCategory._id}
                              className="flex items-center gap-2"
                            >
                              <input
                                id={`category-${childCategory._id}`}
                                required
                                type="radio"
                                name="category"
                                value={childCategory._id}
                                onChange={handleChange}
                                className="focus:ring focus:ring-blue-300"
                              />
                              <span>{childCategory.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              cập nhật sản phẩm
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
