import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-800 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <p className="text-lg font-semibold mb-4">THÔNG TIN LIÊN HỆ</p>
          <div className="space-y-2 text-gray-300">
            <p className="flex items-center gap-2">
              <i className="bx bx-map text-xl"></i> 219 Trung Kính, Yên Hòa, Cầu
              Giấy, Hà Nội
            </p>
            <p className="flex items-center gap-2">
              <i className="bx bx-mail-send text-xl"></i> nampew2004@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <i className="bx bxs-phone-call text-xl"></i> 0378479612
            </p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold mb-4">CHÍNH SÁCH</p>
          <ul className="space-y-2 text-gray-300">
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo hành</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách vận chuyển</li>
            <li>Chính sách khuyến mãi</li>
          </ul>
        </div>
        <div>
          <p className="text-lg font-semibold mb-4">MẠNG XÃ HỘI</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/pham.hainam.7146"
              className="block w-10 h-10"
            >
              <img
                src="https://contabilidadeessencia.com.br/wp-content/uploads/2021/12/facebook-logo-3-1-1-1024x1024.png"
                alt="Facebook"
                className="w-full h-full object-contain"
              />
            </a>
            <a href="https://chat.zalo.me/" className="block w-10 h-10">
              <img
                src="https://noithatdaingan.vn/uploads/img/zalo.png"
                alt="Zalo"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="https://www.instagram.com/tainangtre.wxrnam/"
              className="block w-10 h-10"
            >
              <img
                src="http://pngimg.com/uploads/instagram/instagram_PNG9.png"
                alt="Instagram"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
        </div>
        <div className="map">
          <p className="title text-lg font-bold mb-4">BẢN ĐỒ</p>
          <div className="relative w-full h-0 pb-[56.25%]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7447.919277339562!2d105.79169279999999!3d21.034300900000012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1691758865951!5m2!1svi!2s"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8">
        © 2024 YourCompanyName. All rights reserved.
      </div>
    </footer>
  );
}
