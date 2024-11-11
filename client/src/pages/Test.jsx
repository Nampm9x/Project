import React, { useState } from 'react';
import Modal from 'react-modal';

// Cấu hình root element cho modal
Modal.setAppElement('#root');

function Test() {
  const [isOpen, setIsOpen] = useState(false);

  // Hàm mở modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>Hello, I'm a modal</h2>
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </div>
  );
}

export default Test;
