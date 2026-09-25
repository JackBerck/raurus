import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RaUrus — Pencatat Keuangan Cepat AI',
    short_name: 'RaUrus',
    description: 'Catat pengeluaran & pemasukan harian secepat kilat dengan AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#080d0a',
    theme_color: '#080d0a',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
