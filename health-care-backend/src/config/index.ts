import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,

    // cloudinary
    cloudinary: {
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY
    },

    // JWT
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET,
        access_expires: process.env.JWT_ACCESS_EXPIRES,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_expires: process.env.JWT_REFRESH_EXPIRES,
    },

    // OPEN ROUTER API
    openRouterApiKey: process.env.OPENROUTER_API_KEY


}