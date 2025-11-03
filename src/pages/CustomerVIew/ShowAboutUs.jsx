import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ShowFounderDetails from "./ShowFounderDetails";
import { aboutPublicInfoRequest } from "../../redux/actions/aboutActions";
import { founderPublicListRequest } from "../../redux/actions/founderActions";
import { Spin } from "antd";

const ShowAboutUs = () => {
  const dispatch = useDispatch();
  const { publicData: aboutData, publicLoading } = useSelector((state) => state.about);
  const { publicItems: founders, publicLoadingList } = useSelector((state) => state.founder);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFounderId, setSelectedFounderId] = useState(null);
  const [isFounderModalVisible, setIsFounderModalVisible] = useState(false);

  useEffect(() => {
    dispatch(aboutPublicInfoRequest());
    dispatch(founderPublicListRequest());
  }, [dispatch]);

  const handleFounderClick = (founderId) => {
    setSelectedFounderId(founderId);
    setIsFounderModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsFounderModalVisible(false);
    setSelectedFounderId(null);
  };

  if (publicLoading || publicLoadingList) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center justify-center flex-grow">
          <Spin size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="container mx-auto px-4 py-16 text-center flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Chưa có thông tin</h1>
          <p className="text-gray-600">Vui lòng quay lại sau.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {aboutData.logo && (
              <img
                src={aboutData.logo}
                alt={aboutData.storeName}
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-white p-2 object-contain"
              />
            )}
            <h1 className="text-5xl font-bold mb-4">{aboutData.storeName}</h1>
            {aboutData.slogan && (
              <p className="text-xl text-blue-100 mb-8">{aboutData.slogan}</p>
            )}
          </div>
        </div>
      </section>

      {/* Story Section */}
      {aboutData.story && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Câu chuyện của chúng tôi</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">{aboutData.story}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      {(aboutData.mission || aboutData.vision) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {aboutData.mission && (
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{aboutData.mission}</p>
                </div>
              )}
              {aboutData.vision && (
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">👁️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{aboutData.vision}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      {aboutData.coreValues && aboutData.coreValues.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Giá trị cốt lõi</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {aboutData.coreValues.map((value, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  {value.icon && (
                    <img
                      src={value.icon}
                      alt={value.title}
                      className="w-16 h-16 mb-4 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statistics */}
      {aboutData.stats && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Thành tựu của chúng tôi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {aboutData.stats.yearsOfOperation > 0 && (
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{aboutData.stats.yearsOfOperation}+</div>
                  <div className="text-blue-100">Năm hoạt động</div>
                </div>
              )}
              {aboutData.stats.totalCustomers > 0 && (
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{aboutData.stats.totalCustomers.toLocaleString()}+</div>
                  <div className="text-blue-100">Khách hàng</div>
                </div>
              )}
              {aboutData.stats.totalProducts > 0 && (
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{aboutData.stats.totalProducts.toLocaleString()}+</div>
                  <div className="text-blue-100">Sản phẩm</div>
                </div>
              )}
              {aboutData.stats.totalOrders > 0 && (
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{aboutData.stats.totalOrders.toLocaleString()}+</div>
                  <div className="text-blue-100">Đơn hàng</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Founders Section */}
      {founders && founders.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Đội ngũ sáng lập</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {founders.map((founder) => (
                <div
                  key={founder._id}
                  onClick={() => handleFounderClick(founder._id)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {founder.avatar && (
                    <img
                      src={founder.avatar}
                      alt={founder.fullName}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{founder.fullName}</h3>
                    <p className="text-blue-600 font-semibold mb-4">{founder.position}</p>
                    {founder.quote && (
                      <p className="text-gray-600 italic mb-4 border-l-4 border-blue-500 pl-4">
                        &ldquo;{founder.quote}&rdquo;
                      </p>
                    )}
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{founder.bio}</p>
                    {founder.achievements && founder.achievements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Thành tựu:</p>
                        <ul className="space-y-1">
                          {founder.achievements.slice(0, 3).map((achievement, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              • {achievement.title} {achievement.year && `(${achievement.year})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(founder.socialMedia?.facebook || founder.socialMedia?.instagram || founder.socialMedia?.linkedin) && (
                      <div className="mt-4 flex space-x-3">
                        {founder.socialMedia.facebook && (
                          <a href={founder.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            Facebook
                          </a>
                        )}
                        {founder.socialMedia.instagram && (
                          <a href={founder.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                            Instagram
                          </a>
                        )}
                        {founder.socialMedia.linkedin && (
                          <a href={founder.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Thông tin liên hệ</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Địa chỉ</h3>
                <p className="text-gray-700 mb-6">{aboutData.address}</p>
                {aboutData.workingHours && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Giờ làm việc</h3>
                    <p className="text-gray-700">{aboutData.workingHours}</p>
                  </>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Liên hệ</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> <a href={`mailto:${aboutData.email}`} className="text-blue-600 hover:underline">{aboutData.email}</a>
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Điện thoại:</strong> <a href={`tel:${aboutData.phone}`} className="text-blue-600 hover:underline">{aboutData.phone}</a>
                </p>
                {aboutData.socialMedia && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Mạng xã hội</h3>
                    <div className="flex flex-wrap gap-3">
                      {aboutData.socialMedia.facebook && (
                        <a href={aboutData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Facebook
                        </a>
                      )}
                      {aboutData.socialMedia.instagram && (
                        <a href={aboutData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                          Instagram
                        </a>
                      )}
                      {aboutData.socialMedia.twitter && (
                        <a href={aboutData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                          Twitter
                        </a>
                      )}
                      {aboutData.socialMedia.youtube && (
                        <a href={aboutData.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          YouTube
                        </a>
                      )}
                      {aboutData.socialMedia.linkedin && (
                        <a href={aboutData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Details Modal */}
      <ShowFounderDetails
        visible={isFounderModalVisible}
        founderId={selectedFounderId}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
};

export default ShowAboutUs;

