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
        const res = await fetch(`/api/category/get-one-child-category/${currentProduct.category}`);
        const data = await res.json();
        setOldCategory(data.name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOldCategory();
  }, []);


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
          // Optional: Handle progress here if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
        },
        () => {
          // Handle successful uploads on complete
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
      setCurrentProduct(data)
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
        const fileName = `${new Date().getTime()}-${index}-${fileImage.name}`; // Unique filename per image
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
    <div className="mb-5">
      <img src={currentProduct.thumbnail} alt="" className="w-40 h-40" />
      <div>{currentProduct.name}</div>
      <div>{currentProduct.price}</div>
      <div>{currentProduct.category.name}</div>
      <button
        type="button"
        onClick={() => handleDeleteProduct(product._id)}
        className="border px-3 py-1 bg-red-400 text-white"
      >
        Xóa
      </button>
      <button
        onClick={openEditProductModal}
        type="button"
        className="border px-3 py-1 bg-blue-400 text-white"
      >
        Sửa
      </button>

      <Modal
        isOpen={modalEditProductIsOpen}
        onRequestClose={closeEditProductModal}
        className="w-full md:w-1/2 lg:w-1/3 z-50 rounded-md bg-white overflow-y-auto"
        overlayClassName="fixed mt-16 lg:mt-0 z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="overflow-y-auto h-[90vh]">
          <h2>edit product</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="">product name</label>
            <input
              onChange={handleChange}
              type="text"
              value={formData.name}
              name="name"
            />
            <br />
            <label htmlFor="">Quantity</label>
            <input
              onChange={handleChange}
              type="number"
              value={formData.quantity}
              name="quantity"/>
              <br/>
            <label htmlFor="">thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {formData.thumbnail ? (
              <img src={formData.thumbnail} alt="" className="w-40 h-40" />
            ) : (
              <img src={formData.thumbnail} alt="" className="w-40 h-40" />
            )}
            <button type="button" onClick={handleUploadImage}>
              upload
            </button>
            <br />
            <label htmlFor="">product detail</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            {formData.images
              ? formData.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Uploaded ${index}`}
                    className="w-40 h-40"
                  />
                ))
              : currentProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Uploaded ${index}`}
                    className="w-40 h-40"
                  />
                ))}
            <button type="button" onClick={handleUploadImages}>
              upload
            </button>
            <br />
            <label htmlFor="">price</label>
            <input
              onChange={handleChange}
              type="number"
              value={formData.price}
              name="price"
            />
            <br />
            <label htmlFor="">category</label>
            <div>old category: {oldCategory}</div>
            <div className="flex gap-3">
              {categories.map((category) => (
                <div key={category._id}>
                  <div
                    onClick={() => handleGetChildCategories(category._id)}
                    className="px-3 py-1 border"
                  >
                    {category.name}
                  </div>
                  {whichCategory === category._id &&
                    childCategories.length > 0 && (
                      <div>
                        {childCategories.map((childCategory) => (
                          <label
                            htmlFor={`${childCategory._id}`}
                            key={childCategory._id}
                          >
                            {childCategory.name}
                            <input
                              required
                              type="radio"
                              id={`${childCategory._id}`}
                              name="category"
                              value={childCategory._id}
                              onChange={handleChange}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
            <button type="submit">add</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
