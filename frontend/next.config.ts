import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.pixabay.com',
      'images.pexels.com',
      'picsum.photos',
      'via.placeholder.com',
      'i.postimg.cc' 
    ]
  }
};

export default nextConfig;
