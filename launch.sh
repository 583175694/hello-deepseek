# 更新代码
git pull
# 客户端
cd client
# 重新安装依赖
npm install
# 重新构建
npm run build
# 重启服务
pm2 delete chat-client
pm2 start npm --name chat-client -- start

# 服务端
cd ..
# 进入服务端目录
cd server
# 重新安装依赖
npm install
# 重新构建
npm run build
# 删除旧的服务端进程
pm2 delete chat-server
# 启动新的服务端进程
pm2 start npm --name chat-server -- start