import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from "react-modal";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

export default function ProductManagement() {
  const [modalCreateProductIsOpen, setModalCreateProductIsOpen] =
    useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateProductModal = () => setModalCreateProductIsOpen(true);
  const closeCreateProductModal = () => setModalCreateProductIsOpen(false);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed", () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, thumbnail: downloadURL });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadImages = async () => {
    try {
      if (!files || files.length === 0) {
        return;
      }

      const storage = getStorage(app);
      const uploadPromises = Array.from(files).map((fileImage) => {
        const fileName = new Date().getTime() + "-" + fileImage.name;
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
      console.log(error);
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
      setModalCreateProductIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Product Management</h2>
      <div className="">So luong san pham: 3</div>
      <button
        type="button"
        onClick={openCreateProductModal}
        className="flex gap-2 items-center border px-3 py-1"
      >
        <IoIosAddCircleOutline />
        San pham
      </button>
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
            <label htmlFor="">thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="" className="w-40 h-41" />
            )}
            <button type="button" onClick={handleUpdloadImage}>
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
            <select onChange={handleChange} name="category" id="">
              <option value="ao">ao</option>
              <option value="quan">quan</option>
              <option value="giay">giay</option>
              <option value="mu">mu</option>
            </select>
            <button type="submit">add</button>
          </form>
        </div>
      </Modal>
    </>
  );
}
