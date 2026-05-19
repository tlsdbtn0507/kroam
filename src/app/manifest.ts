import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Setlog Camera',
    short_name: 'Setlog',
    description: '브이로그 스타일 카메라 촬영 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png', // public 폴더에 192x192 1:1 비율의 아이콘을 추가해주세요.
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png', // public 폴더에 512x512 아이콘을 추가해주세요.
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
