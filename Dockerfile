# 基于官方 Node.js 镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 安装 cloudflared
RUN apt-get update && \
    apt-get install -y wget && \
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && \
    dpkg -i cloudflared-linux-amd64.deb

# 启动 cloudflared tunnel 和应用
CMD cloudflared tunnel --no-autoupdate run --token eyJhIjoiZDdhNWM1YjJmNGIyMDEyZTFiNjE3MzQwMWYyNDdkMDQiLCJ0IjoiZDY1NjRhNzgtNWM2Ny00MGQzLThlYzQtZDk4ZTQyN2YwZWRlIiwicyI6IlpHUm1OVGczTUdRdFltWTFNQzAwTVRnM0xXSTFOR1V0TVRnek9EUXpNR05tWVRneSJ9 & \
    npm start

# 暴露端口
EXPOSE 5000
