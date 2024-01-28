pnpm install
pnpm run build

current_dir=$(pwd)

docker rm -f anti-996-page
docker run -d -p 80:80 \
-v $current_dir/dist:/usr/share/nginx/html \
--name anti-996-page \
nginx:latest
