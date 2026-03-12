import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error('请在 .env.local 中设置 MONGODB_URI');
}

if (process.env.NODE_ENV === 'development') {
    // 开发环境使用全局变量，避免热重载时创建多个连接
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // 生产环境直接连接
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;