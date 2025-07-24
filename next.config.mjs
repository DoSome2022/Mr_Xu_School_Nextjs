/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:['res.cloudinary.com','console.cloudinary.com']
    },
    experimental:{
        serverActions:{
            bodySizeLimit: '50mb'
        }
    }
};

export default nextConfig;
