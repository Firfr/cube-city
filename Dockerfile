# 编译阶段
FROM node:20.19.5-alpine3.21 AS build
WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com
    
COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build
RUN cp src/assets/font.css dist/assets/ && cp src/assets/yMJRMIlzdpvBhQQL_Qq7dy0.woff2 dist/assets/

RUN chmod -R 777 /app/dist

## 启动命令
# ENTRYPOINT ["executable", "param1", "param2"]
# CMD [""]

# 最终镜像
FROM lipanski/docker-static-website:2.6.0

# 静态文件路径 /home/static
COPY --from=build /app/dist /home/static/

ENTRYPOINT ["/busybox-httpd", "-f", "-v"]
CMD [ "-p", "5141" ]

# 暴露端口
EXPOSE 5141

# docker buildx build --platform linux/amd64 --tag firfe/cube-city:2025.09.10 --load .
# docker buildx build --platform linux/arm64 --tag firfe/cube-city:2025.09.10-arm64 --load .
