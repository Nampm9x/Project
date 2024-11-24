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

Modal.setAppElement("#root");

export default function ProductManagement() {
  const [modalCreateProductIsOpen, setModalCreateProductIsOpen] =
    useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null);
  const [categories, setCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [whichCategory, setWhichCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    });
  };
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
    if(searchProduct === "") return;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/search-product/${searchProduct}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

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
      
      <h2>Product Management</h2>
      <div className="">So luong san pham {products.length}</div>
      <input type="text" placeholder="Tìm kiếm sản phẩm" onChange={(e)=>setSearchProduct(e.target.value)}/>
      <button
        type="button"
        onClick={openCreateProductModal}
        className="flex gap-2 items-center border px-3 py-1"
      >
        <IoIosAddCircleOutline />
        San pham
      </button>
      {products.map((product) => (
        <Product
          key={product._id}
          product={product}
          setProducts={setProducts}
        />
      ))}
      {
        products.length === 0 && <div>Khong co san pham</div>
      }
      <Modal
        isOpen={modalCreateProductIsOpen}
        onRequestClose={closeCreateProductModal}
        className="w-full md:w-1/2 lg:w-1/3 z-50 rounded-md bg-white overflow-y-auto"
        overlayClassName="fixed mt-16 lg:mt-0 z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div>
          <h2>add product</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="">product name</label>
            <input onChange={handleChange} type="text" name="name" />
            <br />
            <label htmlFor="">quantity</label>
            <input type="number" name="quantity" onChange={handleChange} />
            <label htmlFor="">thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="" className="w-40 h-41" />
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
            {formData.images &&
              formData.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="w-40 h-41"
                />
              ))}
            <button type="button" onClick={handleUploadImages}>
              upload
            </button>
            <br />
            <label htmlFor="">price</label>
            <input onChange={handleChange} type="number" name="price" />
            <br />
            <label htmlFor="">category</label>
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
    </>
  );
}
