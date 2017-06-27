FROM kitematic/hello-world-nginx:latest
MAINTAINER Phil Toms <philtcos@gmail.com>
RUN rm -rf /website_files/*.*
COPY ./build/index.html /website_files
COPY ./build/main.js /website_files
