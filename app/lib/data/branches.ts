// Centralized branch data with geographic coordinates
// Used for nearest-branch suggestion feature

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  address: string;
  lat: number;
  lng: number;
  schedule: string;
  fee: string;
  isFree: boolean;
  description: string;
}

export const BRANCHES: Branch[] = [
  {
    id: "van-yen",
    name: "Cơ sở 1: Trường TH Văn Yên - Hà Đông",
    shortName: "Cơ sở Hà Đông (Văn Yên)",
    address: "Trường Tiểu học Văn Yên, Hà Đông, Hà Nội",
    lat: 20.971978552750357,
    lng: 105.78445747861716,
    schedule: "Thứ 2-4-6 | 18:30-20:30",
    fee: "MIỄN PHÍ",
    isFree: true,
    description: "Cơ sở chính, miễn phí hoàn toàn cho mọi lứa tuổi",
  },
  {
    id: "kien-hung",
    name: "Cơ sở 2: Vườn hoa Hằng Bè - Kiến Hưng",
    shortName: "Cơ sở Kiến Hưng",
    address: "Vườn hoa Hàng Bè, Kiến Hưng, Hà Đông, Hà Nội",
    lat: 20.949293850764814,
    lng: 105.78932574110247,
    schedule: "Thứ 3-5-7 | 17:45-19:00",
    fee: "MIỄN PHÍ",
    isFree: true,
    description: "Cơ sở 2 tại Hà Đông, miễn phí hoàn toàn",
  },
  {
    id: "thong-nhat",
    name: "Cơ sở 3: Công viên Thống Nhất - Hai Bà Trưng",
    shortName: "Cơ sở Thống Nhất",
    address: "Công viên Thống Nhất, Hai Bà Trưng, Hà Nội",
    lat: 21.014492730365646,
    lng: 105.84399067719092,
    schedule: "Thứ 3-5-7 | 19:00-21:00",
    fee: "300.000đ/tháng",
    isFree: false,
    description: "Công viên Thống Nhất, quận Hai Bà Trưng",
  },
  {
    id: "hoa-binh",
    name: "Cơ sở 4: Công viên Hòa Bình - Bắc Từ Liêm",
    shortName: "Cơ sở Hòa Bình",
    address: "Công viên Hòa Bình, Bắc Từ Liêm, Hà Nội",
    lat: 21.06428003971181,
    lng: 105.78777311101915,
    schedule: "Thứ 3-5-7 | 19:00-21:00",
    fee: "300.000đ/tháng",
    isFree: false,
    description: "Công viên Hòa Bình, quận Bắc Từ Liêm",
  },
  {
    id: "kim-giang",
    name: "Cơ sở 5: Kim Giang - Thanh Xuân",
    shortName: "Cơ sở Kim Giang",
    address: "Sân chơi cạnh TH Ngôi sao Hoàng Mai cổng số 4, Kim Giang, Hà Nội",
    lat: 20.974725584573914,
    lng: 105.82238270205782,
    schedule: "Thứ 3-5-7 | 19:00-21:00",
    fee: "300.000đ/tháng",
    isFree: false,
    description: "Khu vực Kim Giang, quận Hoàng Mai",
  },
];
