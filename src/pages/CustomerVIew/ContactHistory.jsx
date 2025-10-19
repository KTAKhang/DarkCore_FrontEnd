import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { contactListRequest } from "../../redux/actions/contactActions";

const ContactHistory = () => {
  const dispatch = useDispatch();
  const { list, loadingList } = useSelector(state => state.contact);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    dispatch(contactListRequest({ page: 1, limit: 100 }));
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusConfig = (status) => {
    const configs = {
      Pending: { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: Clock,
        label: "Đang chờ"
      },
      "In Progress": { 
        color: "bg-blue-100 text-blue-800 border-blue-200", 
        icon: MessageSquare,
        label: "Đang xử lý"
      },
      Resolved: { 
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle,
        label: "Đã giải quyết"
      },
      Closed: { 
        color: "bg-gray-100 text-gray-800 border-gray-200", 
        icon: AlertCircle,
        label: "Đã đóng"
      }
    };
    return configs[status] || configs.Pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "text-green-600",
      Medium: "text-yellow-600",
      High: "text-orange-600",
      Urgent: "text-red-600"
    };
    return colors[priority] || colors.Medium;
  };

  if (loadingList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600 text-lg">Đang tải lịch sử liên hệ...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lịch sử liên hệ</h1>
              <p className="text-gray-600 mt-1">Theo dõi và quản lý các yêu cầu hỗ trợ của bạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {(list?.data || []).length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có liên hệ nào</h3>
            <p className="text-gray-600">Các yêu cầu hỗ trợ của bạn sẽ xuất hiện tại đây</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.data.map(contact => {
              const statusConfig = getStatusConfig(contact.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedIds.includes(contact._id);
              const hasReplies = contact.replies && contact.replies.length > 0;

              return (
                <div 
                  key={contact._id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Header */}
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpand(contact._id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {contact.subject}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex items-center gap-1 shrink-0`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(contact.createdAt).toLocaleString("vi-VN")}</span>
                          </div>
                          <div className={`font-medium ${getPriorityColor(contact.priority)}`}>
                            {contact.priority === "Low" ? "Thấp" : 
                             contact.priority === "Medium" ? "Trung bình" :
                             contact.priority === "High" ? "Cao" : "Khẩn cấp"}
                          </div>
                          {hasReplies && (
                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                              <MessageSquare className="w-4 h-4" />
                              <span>{contact.replies.length} phản hồi</span>
                            </div>
                          )}
                        </div>

                        {!isExpanded && (
                          <p className="text-gray-700 line-clamp-2">{contact.message}</p>
                        )}
                      </div>

                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      {/* Original Message */}
                      <div className="p-6">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {contact.userId?.user_name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Bạn</div>
                              <div className="text-xs text-gray-500">
                                {new Date(contact.createdAt).toLocaleString("vi-VN")}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                        </div>
                      </div>

                      {/* Replies */}
                      {hasReplies && (
                        <div className="px-6 pb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">Phản hồi từ hỗ trợ</h4>
                          </div>
                          <div className="space-y-3">
                            {contact.replies.map(reply => (
                              <div 
                                key={reply._id} 
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">A</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-blue-900">
                                      {reply.senderId?.user_name || "Admin"}
                                    </div>
                                    <div className="text-xs text-blue-600">
                                      {new Date(reply.createdAt).toLocaleString("vi-VN")}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-800 whitespace-pre-wrap ml-10">
                                  {reply.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!hasReplies && (
                        <div className="px-6 pb-6">
                          <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Chưa có phản hồi nào từ bộ phận hỗ trợ</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ContactHistory;