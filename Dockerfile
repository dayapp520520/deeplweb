
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和其他可能的依赖文件
COPY package*.json ./

# 安装项目依赖，包括开发依赖
RUN npm install --also=dev

# 复制所有源代码到工作目录
COPY . .

# 暴露5000端口
EXPOSE 5000

# 定义环境变量
ENV NODE_ENV=production

# 运行应用程序
CMD ["npm", "start"]
