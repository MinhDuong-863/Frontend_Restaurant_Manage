export const TIME_ZONE = [
  {
    value: '8:00',
    label: '8:00',
  },
  {
    value: '9:00',
    label: '9:00',
  },
  {
    value: '10:00',
    label: '10:00',
  },
  {
    value: '11:00',
    label: '11:00',
  },
  {
    value: '12:00',
    label: '12:00',
  },
  {
    value: '13:00',
    label: '13:00',
  },
  {
    value: '14:00',
    label: '14:00',
  },
  {
    value: '15:00',
    label: '15:00',
  },
  {
    value: '16:00',
    label: '16:00',
  },
  {
    value: '17:00',
    label: '17:00',
  },
  {
    value: '18:00',
    label: '18:00',
  },
  {
    value: '19:00',
    label: '19:00',
  },
  {
    value: '20:00',
    label: '20:00',
  }
]

export const TABLE_TYPES = [
  {
    value: 'normal',
    label: 'Bàn thường',
  },
  {
    value: 'VIP',
    label: 'Bàn Vip',
  }
]

export const POSITIONS = [
  {
    value: 'Nhân viên phục vụ',
    label: 'Nhân viên phục vụ',
  },
  {
    value: "Quản lý",
    label: 'Quản lý',
  }
]

export const TYPE_OF_RECRUITMENT = [
  {
    value: "fulltime",
    label: 'Toàn thời gian (full-time)',
  },
  {
    value: "parttime",
    label: 'Bán thời gian (part-time)',
  }
]

export const TYPE_OF_FOOD = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: 'appetizer',
    label: 'Món khai vị',
  },
  {
    value: 'MainCourse',
    label: 'Món chính',
  },
  {
    value: 'SideDishes',
    label: 'Món ăn kèm',
  },
  {
    value: 'Desserts',
    label: 'Món tráng miệng',
  },
  {
    value: 'Drinks',
    label: 'Đồ uống',
  },
  {
    value: 'Specialties',
    label: 'Món đặc sản',
  }
]
export const REQUIREMENTS = [
  {
    value: "Chưa có kinh nghiệm",
    label: 'Chưa có kinh nghiệm',
  },
  {
    value: "Dưới 1 năm kinh nghiệm",
    label: 'Dưới 1 năm kinh nghiệm',
  },
  {
    value: "1-2 năm kinh nghiệm",
    label: '1-2 năm kinh nghiệm',
  },
  {
    value: "Trên 2 năm kinh nghiệm",
    label: 'Trên 2 năm kinh nghiệm',
  },
  {
    value: "Trên 3 năm kinh nghiệm",
    label: "Trên 3 năm kinh nghiệm"
  },
  {
    value: "Trên 5 năm kinh nghiệm",
    label: "trên 5 năm kinh nghiệm"
  }
]
// enum: ['Not viewed', 'Viewed', 'Successful', 'Rejected'],
export const STATUS_APPLY = [
  {
    value: 'Successful',
    label: 'Chấp nhận',
  },
  {
    value: 'Rejected',
    label: 'Từ chối',
  },
  {
    value: 'Not viewed',
    label: 'Chưa xem',
  },
  {
    value: 'Viewed',
    label: 'Đã xem',
  }
]

export const STATUS_PAYMENT = [
  {
    key: '',
    label: 'Tất cả',
  },
  {
    key: 'pending',
    label: 'Chưa thanh toán',
  },
  {
    key: 'paid',
    label: 'Đã thanh toán',
  },
  {
    key: 'refunded',
    label: 'Hoàn tiền',
  }
]
export const STATUS_ORDER = [
  {
    key: '',
    label: 'Tất cả',
    color: '#000', // Màu đen
  },
  {
    key: 'pending',
    label: 'Chờ xác nhận',
    color: '#FFA500', // Màu cam
  },
  {
    key: 'confirmed',
    label: 'Đã xác nhận',
    color: '#1890FF', // Màu xanh dương
  },
  {
    key: 'completed',
    label: 'Hoàn thành',
    color: '#52C41A', // Màu xanh lá
  },
  {
    key: 'canceled',
    label: 'Đã hủy',
    color: '#FF4D4F', // Màu đỏ
  },
];

export const PROMOTION_TYPE = [
  {
    value: 'percentage',
    label: 'Giảm theo %',
  },
  {
    value: 'fixed',
    label: 'Giảm theo số tiền',
  }
]

export const STATUS_PROMOTION = [
  {
    value: 'active',
    label: 'Hoạt động',
  },
  {
    value: 'inactive',
    label: 'Không sử dụng',
  }
]