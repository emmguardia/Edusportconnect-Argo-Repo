# ÉduSport Connect

Site de l'association ÉduSport Connect — [edusportconnect.fr](https://edusportconnect.fr) : présentation de l'asso, événements, bénévolat, partenaires, formulaire de contact et back-office d'administration.

Développé, hébergé et maintenu par [Zenix Web](https://zenixweb.fr).

## Stack

| Partie | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router — servi par nginx |
| Backend | Node.js, Express 5, Zod (validation), Helmet (en-têtes de sécurité), rate limiting |
| Base de données | MariaDB, cluster Galera 3 nœuds (réplication synchrone, TLS), sauvegardes hors site |
| Emails | service d'envoi interne (confirmation de contact, notifications admin) |
| Hébergement | serveurs Zenix Web en France, cluster Kubernetes (k3s) multi-nœuds |
| Déploiement | GitOps : GitHub Actions → GHCR → Argo CD, chart Helm |

## Structure

```
Frontend/   application React (site public + back-office /admin)
Backend/    API Express (événements, contact, authentification, admin)
  routes/     routes publiques et admin
  scripts/    migrations SQL et création du premier compte admin
charts/     chart Helm (déploiements, services, NetworkPolicy, HPA, PDB, SealedSecret)
argocd/     application Argo CD
scripts/    outillage de scellement des secrets (kubeseal)
```

## Sécurité

- Back-office protégé par cookie `__Host-` httpOnly / Secure / SameSite=strict, mots de passe hachés en bcrypt
- Entrées validées avec Zod, requêtes SQL paramétrées, limitation du nombre de requêtes
- Images vérifiées par leur contenu réel à l'envoi, pas seulement par leur extension
- Conteneurs non-root, NetworkPolicy, secrets chiffrés (SealedSecrets) : aucun secret en clair dans le dépôt
- Site accessible uniquement via Cloudflare, aucun port ouvert sur les serveurs
- Chaque image est scannée (Trivy) avant publication et déployée par digest

## Développement local

```bash
cd Backend && pnpm install && pnpm dev      # API sur :3000 (variables dans .env)
cd Frontend && pnpm install && pnpm dev     # site sur :5173
```

Base de données : `pnpm migrate` puis `pnpm seed` (premier compte admin) dans `Backend/`.

## Modifications

Les évolutions du site passent par l'espace client Zenix Web : [app.zenixweb.fr](https://app.zenixweb.fr).
