const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('myblog');
        const posts = db.collection('posts');

        // 先检查是否已存在
        const existing = await posts.findOne({ slug: 'my-first-post' });
        if (existing) {
            console.log('测试文章已存在，跳过');
            return;
        }

        const testPost = {
            title: '我的第一篇博客文章',
            slug: 'my-first-post',
            content: `# 欢迎来到我的博客

这是我用 **Next.js** 和 **MongoDB** 搭建的个人博客。

## 功能特点

- ✅ 服务端渲染
- ✅ Markdown 支持
- ✅ 代码高亮

\`\`\`javascript
// 这是一段示例代码
function sayHello(name) {
  console.log(\`你好，\${name}！\`);
}
sayHello('博客');
\`\`\`

> 未来还会添加更多功能，敬请期待！`,
            excerpt: '这是我的第一篇博客文章，用来测试博客系统的基本功能。',
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await posts.insertOne(testPost);
        console.log('✅ 测试文章添加成功！ID:', result.insertedId);
    } catch (error) {
        console.error('❌ 添加失败:', error);
    } finally {
        await client.close();
    }
}

run();