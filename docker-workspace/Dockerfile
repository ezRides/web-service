FROM httpd

COPY ./ /scripts
RUN chmod +x /scripts/build-env.sh
RUN cd /scripts/ && /scripts/build-env.sh

EXPOSE 80