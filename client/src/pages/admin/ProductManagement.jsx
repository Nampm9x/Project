import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from "react-modal";

export default function ProductManagement() {
    const [modalCreateProductIsOpen, setModalCreateProductIsOpen] = useState(false);

    const openCreateProductModal = () => setModalCreateProductIsOpen(true);
    const closeCreateProductModal = () => setModalCreateProductIsOpen(false);
  return (
    <>
      <h2>Product Management</h2>
      <div className="">So luong san pham: 3</div>
      <button type="button" onClick={openCreateProductModal} className="flex gap-2 items-center border px-3 py-1">
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
          <form>
            <label htmlFor="">product name</label>
            <input type="text" name="name" />
            <label htmlFor="">thumbnail</label>
            <input type="file" name="thumbnail" />
            <label htmlFor="">product detail</label>
            <input type="file" name="image1" />
            <input type="file" name="image2" />
            <input type="file" name="image3" />
            <label htmlFor="">price</label>
            <input type="number" name="price" />
            <label htmlFor="">category</label>
            <select name="category" id="">
                <option value="">ao</option>
                <option value="">quan</option>
                <option value="">giay</option>
                <option value="">mu</option>
            </select>
            <button type="submit">add</button>
          </form>
        </div>
    </Modal>
    </>
  );
}

