/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 保留現有的 domains 配置（若需要兼容舊版或簡單配置）
    domains: ['res.cloudinary.com', 'console.cloudinary.com'],
    // 添加 remotePatterns 以支持阿里雲 OSS 域名
    remotePatterns: [
      {
        protocol: 'http', // 錯誤訊息顯示使用 http，確認是否需要改為 https
        hostname: 'school-mr-xu.oss-cn-hongkong.aliyuncs.com',
        port: '', // 標準端口留空
        pathname: '/**', // 允許該域名下的所有路徑
      },
      {
        protocol: 'https', // 添加 HTTPS 配置以提高安全性
        hostname: 'school-mr-xu.oss-cn-hongkong.aliyuncs.com',
        port: '',
        pathname: '/**',
      },
      // 將現有的 domains 轉換為 remotePatterns 以保持一致性
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'console.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;