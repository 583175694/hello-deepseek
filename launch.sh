# 解压客户端文件
cd ./client
rm -rf .next node_modules package.json package-lock.json
tar -xzf client-dist.tar.gz
rm -rf client-dist.tar.gz

pm2 delete chat-client
pm2 start npm --name chat-client -- start

# 解压服务端文件
cd ../server
rm -rf dist node_modules package.json package-lock.json
tar -xzf server-dist.tar.gz
rm -rf server-dist.tar.gz

# 重启服务
pm2 delete chat-server
pm2 start npm --name chat-server -- start

# # 更新代码
# git pull
# # 客户端
# cd client
# # 重新安装依赖
# npm install
# # 重新构建
# npm run build
# 重启服务


# # 服务端
# cd ..
# # 进入服务端目录
# cd server
# # 重新安装依赖
# npm install --legacy-peer-deps
# # 重新构建
# npm run build

