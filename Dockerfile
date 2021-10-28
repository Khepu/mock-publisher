FROM node:14.16.0-buster as builder

LABEL maintainer="Giorgos Makris <makris.giwrgos1234@gmail.com>"

COPY . .

RUN yarn install \
    && npm run build

FROM base as tester

COPY --from=builder /build /build
COPY --from=builder package.json package.json
COPY --from=builder jest.config.js jest.config.js

RUN yarn test

FROM node:14.16.0-alpine

ENV USER=draive \
    PROJECT=mock-publisher

RUN apk add --no-cache \
    sudo \
    htop

COPY --from=builder /build /opt/$USER/$PROJECT/build
COPY --from=builder /node_modules /opt/$USER/$PROJECT/node_modules
COPY --from=builder /scripts/run.sh /run.sh
COPY --from=builder /healthcheck /healthcheck

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

HEALTHCHECK CMD node healthcheck/check.js

ENTRYPOINT [ "/run.sh" ]
