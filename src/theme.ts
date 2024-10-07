// theme.js (hoặc theme.ts nếu dùng TypeScript)
import { extendTheme } from "@chakra-ui/react";

// Định nghĩa các breakpoints mới
const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",  // bạn có thể thêm các giá trị khác
};

// Tạo theme tùy chỉnh bằng cách mở rộng theme mặc định
const theme = extendTheme({
  breakpoints,
});

export default theme;
