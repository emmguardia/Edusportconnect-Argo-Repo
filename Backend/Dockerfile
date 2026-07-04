FROM node:22-alpine AS runtime

WORKDIR /app

RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# Patch sécurité: forcer picomatch@latest (CVE-2026-33671) et sigstore@latest (CVE-2026-48815)
RUN npm install -g picomatch@latest sigstore@latest \
    && G="/usr/local/lib/node_modules" \
    && for pkg in picomatch sigstore; do \
         for d in $(find "$G" -name "$pkg" -type d 2>/dev/null); do \
           [ "$d" = "$G/$pkg" ] && continue; \
           rm -rf "$d" && cp -r "$G/$pkg" "$d"; \
         done; \
       done \
    && npm cache clean --force

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund --loglevel=error

# Re-patch après npm ci
RUN for pkg in picomatch sigstore; do \
      for d in $(find /usr/local/lib/node_modules /app/node_modules -name "$pkg" -type d 2>/dev/null); do \
        [ "$d" = "/usr/local/lib/node_modules/$pkg" ] && continue; \
        rm -rf "$d" && cp -r "/usr/local/lib/node_modules/$pkg" "$d"; \
      done; \
    done

COPY . .

RUN mkdir -p uploads/events

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
