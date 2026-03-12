import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '请填写文章标题'],
        maxlength: [100, '标题不能超过100字'],
    },
    slug: {
        type: String,
        required: [true, '请填写文章slug'],
        unique: true,
    },
    content: {
        type: String,
        required: [true, '请填写文章内容'],
    },
    excerpt: {
        type: String,
        maxlength: [200, '摘要不能超过200字'],
    },
    coverImage: {
        type: String,
    },
    published: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);