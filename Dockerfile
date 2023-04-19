ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}
ARG EMSDK_VERSION=latest
ARG WORKDIR=/runes

RUN apt update && \
  apt install -yq cmake && \
  git clone https://github.com/emscripten-core/emsdk.git && \
  cd emsdk && \
  ./emsdk install ${EMSDK_VERSION} && \
  ./emsdk activate ${EMSDK_VERSION} && \
  git config --global --add safe.directory ${WORKDIR} && \
  git config --global --add safe.directory ${WORKDIR}/packages/matron/norns

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

WORKDIR ${WORKDIR}
CMD ["/bin/bash"]
