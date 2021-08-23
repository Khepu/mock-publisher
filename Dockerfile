FROM node:14.16.0-buster as creator

LABEL maintainer="Giorgos Makris <makris.giwrgos1234@gmail.com>"

COPY . .

ENV RABBIT_HOST=localhost \
    RABBIT_PORT=5672 \
    RABBIT_USER=guest \
    RABBIT_PASS=guest \
    LOGGING_LEVEL=warn

RUN yarn install \
    && npm run build \
    && chmod +x /scripts/generateEnv.sh \
    && /scripts/generateEnv.sh

FROM node:14.16.0-alpine

ENV USER=draive \
    PROJECT=mock-publisher

RUN apk add --no-cache \
    sudo \
    htop

COPY --from=creator /build /opt/$USER/$PROJECT/build
COPY --from=creator /node_modules /opt/$USER/$PROJECT/node_modules
COPY --from=creator /.env /opt/$USER/$PROJECT/
COPY --from=creator /scripts/run.sh /run.sh

# sudo has a log-bug thus the "Set"
# check https://github.com/sudo-project/sudo/issues/42
RUN addgroup -S $USER \
    && echo "Set disable_coredump false" >> /etc/sudo.conf \
    && echo "$USER ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$USER \
    && adduser -S -g $USER $USER \
    && mkdir -p /home/$USER/Downloads \
    && chown -R $USER:$USER /home/$USER \
        /opt/$USER/$PROJECT \
        /run.sh \
    && chmod 0440 /etc/sudoers.d/$USER \
    && chmod 755 /run.sh

USER $USER

ENTRYPOINT [ "/run.sh" ]
