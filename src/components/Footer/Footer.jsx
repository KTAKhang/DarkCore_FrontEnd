import { useAboutUs } from "../../hooks/useAboutUs";

const Footer = () => {
    // Sử dụng hook để lấy thông tin AboutUs
    const { aboutData } = useAboutUs();

    // Thông tin shop từ AboutUs
    const shopName = aboutData?.storeName || "DarkCore Shop";
    const shopLogo = aboutData?.logo;
    const description = aboutData?.description || "Chuyên cung cấp laptop, máy tính bảng và dịch vụ sửa chữa chất lượng cao với giá cả hợp lý.";
    const socialMedia = aboutData?.socialMedia || {};

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            {shopLogo ? (
                                <img
                                    src={shopLogo}
                                    alt={shopName}
                                    className="w-10 h-10 rounded-lg object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div 
                                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"
                                style={{ display: shopLogo ? 'none' : 'flex' }}
                            >
                                <span className="text-white text-xl">💻</span>
                            </div>
                            <span className="text-xl font-bold">{shopName}</span>
                        </div>
                        <p className="text-gray-400 mb-4 leading-relaxed">
                            {description}
                        </p>
                        <div className="flex space-x-4">
                            {socialMedia.facebook && (
                                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    📘
                                </a>
                            )}
                            {socialMedia.instagram && (
                                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    📷
                                </a>
                            )}
                            {socialMedia.youtube && (
                                <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    📺
                                </a>
                            )}
                            {socialMedia.linkedin && (
                                <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    💼
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Sản phẩm</h3>
                        <ul className="space-y-2">
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Laptop</a></li>
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Máy tính bảng</a></li>
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Phụ kiện</a></li>
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Sản phẩm giảm giá</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Dịch vụ</h3>
                        <ul className="space-y-2">
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Sửa chữa laptop</a></li>
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Thay màn hình</a></li>
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Nâng cấp phần cứng</a></li>
                            <li><a className="text-gray-400 hover:text-white transition-colors cursor-pointer">Bảo hành</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            {aboutData?.address && (
                                <li className="flex items-center text-gray-400">
                                    <span className="mr-3 text-blue-400">📍</span>{aboutData.address}
                                </li>
                            )}
                            {aboutData?.phone && (
                                <li className="flex items-center text-gray-400">
                                    <span className="mr-3 text-blue-400">📞</span>
                                    <a href={`tel:${aboutData.phone}`} className="hover:text-white transition-colors">
                                        {aboutData.phone}
                                    </a>
                                </li>
                            )}
                            {aboutData?.email && (
                                <li className="flex items-center text-gray-400">
                                    <span className="mr-3 text-blue-400">✉️</span>
                                    <a href={`mailto:${aboutData.email}`} className="hover:text-white transition-colors">
                                        {aboutData.email}
                                    </a>
                                </li>
                            )}
                            {aboutData?.workingHours && (
                                <li className="flex items-center text-gray-400">
                                    <span className="mr-3 text-blue-400">⏰</span>{aboutData.workingHours}
                                </li>
                            )}
                            {!aboutData?.address && !aboutData?.phone && !aboutData?.email && !aboutData?.workingHours && (
                                <>
                                    <li className="flex items-center text-gray-400">
                                        <span className="mr-3 text-blue-400">📍</span>123 Đường ABC, Quận Ninh Kiều, TP.Cần Thơ
                                    </li>
                                    <li className="flex items-center text-gray-400">
                                        <span className="mr-3 text-blue-400">📞</span>0123.456.789
                                    </li>
                                    <li className="flex items-center text-gray-400">
                                        <span className="mr-3 text-blue-400">✉️</span>info@techstore.vn
                                    </li>
                                    <li className="flex items-center text-gray-400">
                                        <span className="mr-3 text-blue-400">⏰</span>8:00 - 22:00 hàng ngày
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;