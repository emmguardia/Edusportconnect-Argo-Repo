# syntax=docker/dockerfile:1.7
#
# Build multi-stage : on installe les deps dans un stage à part, et l'image
# finale ne garde que node + node_modules de prod + le code applicatif.
#
# ── POURQUOI LE PATCH PICOMATCH A DISPARU ────────────────────────────────────
#
# La version précédente réinstallait picomatch « en latest » (CVE-2026-33671,
# ReDoS via extglob) puis recopiait la version corrigée par-dessus toutes les
# copies imbriquées trouvées avec `find`, deux fois — avant et après le npm ci.
#
# picomatch ne vient pas de l'application : c'est une dépendance bundlée de npm
# lui-même. Or le runtime n'exécute que `node server.js` ; npm, npx et corepack
# n'y servent à rien. En les supprimant de l'image finale, cette CVE disparaît
# avec eux — ainsi que celles de tar, cross-spawn, glob, minimatch, undici et
# sigstore. C'est une élimination structurelle, pas un patch à re-maintenir à
# chaque nouvelle CVE, et sans le risque qu'un `cp -r` sur un chemin trouvé par
# `find` écrase autre chose.
#
# L'override `picomatch` de package.json reste en place : il concerne, lui, les
# éventuelles occurrences dans l'arbre de dépendances de l'application.

# ── Stage 1 : dépendances de production ──────────────────────────────────────
FROM node:26-alpine AS deps

ENV NODE_ENV=production \
    PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH

RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# pnpm épinglé. Pas de corepack : il a été retiré du bundle Node à partir de
# Node 25/26.
RUN npm install -g pnpm@10.33.4 --no-audit --no-fund

WORKDIR /app

# .npmrc porte ignore-scripts=true. Aucune dépendance de ce backend n'a besoin
# de builder (toutes en JavaScript pur), donc pnpm.onlyBuiltDependencies est
# volontairement absent de package.json.
COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --prod --frozen-lockfile \
    && pnpm store prune 2>/dev/null || true

# ── Stage 2 : image runtime minimale ─────────────────────────────────────────
FROM node:26-alpine AS runtime

ENV NODE_ENV=production

RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# HARDENING SUPPLY-CHAIN : le runtime n'exécute que `node server.js`.
# Retirer npm, npx, corepack et yarn élimine d'un coup toutes les CVE de leurs
# dépendances bundlées, dont picomatch que ce fichier patchait à la main.
RUN rm -rf \
      /usr/local/lib/node_modules/npm \
      /usr/local/lib/node_modules/corepack \
      /usr/local/bin/npm \
      /usr/local/bin/npx \
      /usr/local/bin/corepack \
      /opt/yarn-* \
      /usr/local/bin/yarn \
      /usr/local/bin/yarnpkg \
    && rm -rf /root/.npm /root/.cache 2>/dev/null || true

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup package.json server.js ./
COPY --chown=appuser:appgroup config/ ./config/
COPY --chown=appuser:appgroup middleware/ ./middleware/
COPY --chown=appuser:appgroup routes/ ./routes/
COPY --chown=appuser:appgroup utils/ ./utils/
# scripts/ (migrate, seed) : lancés à la demande dans le conteneur, pas au
# démarrage. L'ancien `COPY . .` les embarquait — on préserve ce comportement.
COPY --chown=appuser:appgroup scripts/ ./scripts/

# Dossier d'upload inscriptible par l'application
RUN mkdir -p uploads/events && chown -R appuser:appgroup /app/uploads

VOLUME ["/app/uploads"]

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
