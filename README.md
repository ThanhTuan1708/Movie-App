# Movie App

Ứng dụng xem danh sách phim viết bằng **Expo SDK 57 + React Native + Expo Router**.

## Tính năng

- **Danh sách phim** từ MockAPI: dạng danh sách hoặc lưới, kéo để tải lại.
- **Tìm kiếm** theo tên, **lọc** theo thể loại và "Đang chiếu", **sắp xếp** theo điểm / năm / tên.
- **Chi tiết phim**: poster, thể loại, năm, thời lượng, điểm, trạng thái chiếu, nội dung.
- **Yêu thích**: chạm ♡ trên thẻ hoặc trong trang chi tiết; tab Yêu thích có badge, lưu bằng AsyncStorage.
- **Chế độ offline**: nếu API lỗi, app hiển thị dữ liệu mẫu kèm banner "chạm để thử lại".
- Poster lỗi hoặc trống được thay bằng poster minh hoạ tự vẽ theo tên phim.

## Lưu ý về API

Endpoint cũ `https://6abb544eb2118ed7abb83e61.mockapi.io/MovieApp` hiện trả về **404 (Not found)**,
nên app đang chạy bằng dữ liệu mẫu (`src/data/sampleMovies.ts`).
Để dùng dữ liệu thật, tạo resource trên MockAPI với các trường
`id, title, genre, year, rating, poster, isShowing` (tuỳ chọn `description, duration`)
rồi sửa `API_URL` trong `src/config.ts`.

## Cấu trúc

```
src/
  app/
    _layout.tsx          # MoviesProvider + Stack
    (tabs)/index.tsx     # Danh sách phim
    (tabs)/favorites.tsx # Phim yêu thích
    movie/[id].tsx       # Chi tiết phim
  components/            # MovieCard, Poster
  lib/movies.ts          # Gọi API, chuẩn hoá dữ liệu, lọc/sắp xếp (có test)
  lib/MoviesProvider.tsx # State dùng chung + AsyncStorage
  data/sampleMovies.ts   # Dữ liệu dự phòng
  config.ts              # API_URL
__tests__/
```

## Chạy dự án

```bash
npm install
npx expo start
npm test
npm run lint
npm run typecheck
```
