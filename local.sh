# 客户端构建
cd client
npm run build

# 客户端打包
COPYFILE_DISABLE=1 tar --no-xattrs -czf client-dist.tar.gz .next node_modules package.json package-lock.json
# 服务端构建  
# cd ../server
# npm run build

# # 服务端打包
# cd ../server  
# COPYFILE_DISABLE=1 tar --no-xattrs -czf server-dist.tar.gz dist node_modules package.json package-lock.json
cd ..
scp ./client/client-dist.tar.gz ubuntu@175.178.23.83:/www/hello-deepseek/