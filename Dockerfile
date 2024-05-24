# 使用官方Node.js镜像作为基础镜像
FROM node:19

# 安装必要的工具和依赖
RUN apt-get update && \
    apt-get install -y git make golang-go

# 克隆 cloudflared 源代码并编译安装
RUN git clone https://github.com/cloudflare/cloudflared.git /cloudflared && \
    cd /cloudflared && \
    make cloudflared && \
    go install github.com/cloudflare/cloudflared/cmd/cloudflared

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

# 启动 cloudflared tunnel 和应用
CMD /root/go/bin/cloudflared tunnel --no-autoupdate run --token eyJhIjoiZDdhNWM1YjJmNGIyMDEyZTFiNjE3MzQwMWYyNDdkMDQiLCJ0IjoiZDY1NjRhNzgtNWM2Ny00MGQzLThlYzQtZDk4ZTQyN2YwZWRlIiwicyI6IlpHUm1OVGczTUdRdFltWTFNQzAwTVRnM0xXSTFOR1V0TVRnek9EUXpNR05tWVRneSJ9 & \
    npm start
