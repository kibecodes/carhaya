/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.pexels.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'bucket.transfa.org',
                pathname: '/**'
            }
        ]

    }
};

export default nextConfig;
