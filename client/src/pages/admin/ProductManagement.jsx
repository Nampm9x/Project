import { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from "react-modal";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import Product from "../../components/product/Product";
import { BeatLoader } from "react-spinners";

Modal.setAppElement("#root");

export default function ProductManagement() {
  const [modalCreateProductIsOpen, setModalCreateProductIsOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    price: 100000,
  });
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null);
  const [categories, setCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [whichCategory, setWhichCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [isLoadingProductDetail, setIsLoadingProductDetail] = useState(false);

  useEffect(() => {
    if (searchProduct !== "") return;
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/get-product");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [searchProduct]);

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

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "price" && value <= 100000) {
      value = 100000;
    }
    if (name === "quantity" && value <= 0) {
      value = 1;
    }
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    });
  };
  console.log(formData.quantity, formData.price);
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

  const openCreateProductModal = () => setModalCreateProductIsOpen(true);
  const closeCreateProductModal = () => setModalCreateProductIsOpen(false);

  const handleUploadImage = async () => {
    try {
      if (!file) return;
      setIsLoadingThumbnail(true);

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
            setIsLoadingThumbnail(false);
          });
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUploadImages = async () => {
    try {
      if (!files || files.length === 0) return;
      setIsLoadingProductDetail(true);

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
      setIsLoadingProductDetail(false);
    } catch (error) {
      console.log("Error uploading images:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setModalCreateProductIsOpen(false);
      setFormData({});
      setProducts([...products, data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchProduct === "") return;
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/product/search-product/${searchProduct}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [searchProduct]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Quản lý sản phẩm
      </h2>

      <div className="mb-4 text-lg text-gray-600">
        Số lượng sản phẩm:
        <span className="font-semibold text-gray-800 ml-2">
          {products.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          onChange={(e) => setSearchProduct(e.target.value)}
          className="flex-grow border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="button"
          onClick={openCreateProductModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <IoIosAddCircleOutline className="text-lg" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto mb-5 text-sm flex flex-wrap items-center justify-between gap-4 bg-white shadow-md rounded-lg p-4">
        <div className="w-1/12">Hình ảnh</div>
        <div className="flex-1 w-5/12 text-gray-800 font-medium">
          Tên sản phẩm
        </div>
        <div className="flex-1 w-1/12 text-gray-600 text-center">Số lượng</div>
        <div className="flex-1 w-2/12 text-gray-600 text-center">Giá</div>
        <div className="flex-1 w-1/12 text-gray-600 text-center">Danh mục</div>
        <div className="flex gap-2 w-2/12">Hành động</div>
      </div>
      <div className="overflow-x-auto ">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            setProducts={setProducts}
          />
        ))}
      </div>
      <Modal
        isOpen={modalCreateProductIsOpen}
        onRequestClose={closeCreateProductModal}
        className="w-full md:w-1/2 lg:w-1/3 z-50 rounded-md bg-white overflow-y-auto"
        overlayClassName="fixed mt-16 lg:mt-0 z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm</h2>
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-4 border rounded-lg bg-white shadow-md"
          >
            <label className="block text-gray-700 font-medium mb-2">
              Tên sản phẩm
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />
            <label className="block text-gray-700 font-medium mb-2">
              Chi tiết sản phẩm
            </label>
            <textarea
              onChange={handleChange}
              type="text"
              name="description"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />

            <label className="block text-gray-700 font-medium mb-2">
              Số lượng
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />

            <label className="block text-gray-700 font-medium mb-2">
              Hình ảnh
            </label>
            <input
              type="file"
              name="thumbnail"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 mb-2"
            />
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt=""
                className="w-40 h-40 object-cover mb-4"
              />
            )}
            <button
              type="button"
              onClick={handleUploadImage}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isLoadingThumbnail ? <BeatLoader color="#ffffff" /> : "Tải lên"}
            </button>

            <label className="block text-gray-700 font-medium mb-2">
              Hình ảnh chi tiết
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="block w-full text-sm text-gray-500 mb-2"
            />
            {formData.images &&
              formData.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="w-40 h-40 object-cover inline-block mr-2 mb-4"
                />
              ))}
            <button
              type="button"
              onClick={handleUploadImages}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isLoadingProductDetail ? (
                <BeatLoader color="#ffffff" />
              ) : (
                "Tải lên"
              )}
            </button>

            <label className="block text-gray-700 font-medium mb-2">Giá</label>
            <input
              onChange={handleChange}
              type="number"
              name="price"
              value={formData.price}
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />

            <label className="block text-gray-700 font-medium mb-2">
              Danh mục
            </label>
            <div className="flex flex-wrap gap-3 mb-4">
              {categories.map((category) => (
                <div key={category._id} className="border p-2 rounded">
                  <div
                    onClick={() => handleGetChildCategories(category._id)}
                    className="cursor-pointer px-3 py-1 border hover:bg-gray-100 bg-blue-500 rounded text-white"
                  >
                    {category.name}
                  </div>
                  {whichCategory === category._id &&
                    childCategories.length > 0 && (
                      <div className="mt-2">
                        {childCategories.map((childCategory) => (
                          <label
                            htmlFor={`${childCategory._id}`}
                            key={childCategory._id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              id={`${childCategory._id}`}
                              name="category"
                              value={childCategory._id}
                              onChange={handleChange}
                            />
                            <span>{childCategory.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Thêm
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
