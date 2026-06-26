FROM node:22-alpine AS runtime

WORKDIR /app

RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# Patch sécurité: forcer picomatch@latest (CVE-2026-33671 ReDoS via extglob, bundlé dans npm)
RUN npm install -g picomatch@latest \
    && G="/usr/local/lib/node_modules" \
    && for d in $(find "$G" -name "picomatch" -type d 2>/dev/null); do \
         [ "$d" = "$G/picomatch" ] && continue; \
         rm -rf "$d" && cp -r "$G/picomatch" "$d"; \
       done \
    && npm cache clean --force

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund --loglevel=error

# Re-patch picomatch après npm ci
RUN for d in $(find /usr/local/lib/node_modules /app/node_modules -name "picomatch" -type d 2>/dev/null); do \
      [ "$d" = "/usr/local/lib/node_modules/picomatch" ] && continue; \
      rm -rf "$d" && cp -r /usr/local/lib/node_modules/picomatch "$d"; \
    done

COPY . .

RUN mkdir -p uploads/events

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
