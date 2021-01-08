FROM node:12-alpine
LABEL author=peyoot site=https://peyoot.github.io
ADD build_and_run.sh build_and_run.sh
ENV PUBLIC_HEXO_GITHUB_URL=https://github.com/peyoot/peyoot.github.io.git
RUN echo "Asia/Shanghai" > /etc/timezone \
#    && echo "https://mirrors.ustc.edu.cn/alpine/v3.9/main/" > /etc/apk/repositories  \
#    && npm config set registry https://registry.npm.taobao.org \
    && apk add --no-cache git \
    && npm install hexo-cli -g \    
#    && npm install hexo-deployer-git --save \
    && chmod 777 /build_and_run.sh
EXPOSE 4000

ENTRYPOINT ["sh","/build_and_run.sh"]
