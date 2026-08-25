# Deploy naar de Strato VPS M

Voor deze VPS (root-toegang, Node.js), niet voor het gedeelde webhosting-
pakket (PHP/Perl/Python/MySQL/Cron, geen Node.js — daar kan deze app niet op
draaien).

## Vooraf: Supabase moet ook https zijn

De VPS gaat over het publieke internet met je huidige Supabase (thuis, via
`mc.streunding.nl:8000`) praten — dat loopt nu nog over plain http. Zet daar
eerst een reverse proxy + Let's Encrypt-certificaat voor (zelfde aanpak als
hieronder met Caddy, maar dan thuis vóór Kong), **voordat** je
`NEXT_PUBLIC_SUPABASE_URL` op de VPS naar `https://mc.streunding.nl` zet.
Anders gaan sessies/tokens tussen Strato en je thuisnetwerk onversleuteld
over het internet.

## Eenmalige inrichting van de VPS

Aannames: verse Ubuntu/Debian VPS, DNS van `streunding.nl` (en
`www.streunding.nl`) wijst al naar het IP van de VPS.

```bash
# Als root, of met sudo:

# 1. Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git

# 2. Caddy (reverse proxy + automatisch Let's Encrypt-certificaat)
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy

# 3. Eigen, niet-root gebruiker om de app onder te draaien
sudo adduser --system --group --home /opt/streunding streunding

# 4. Code ophalen
sudo -u streunding git clone <repo-url> /opt/streunding
cd /opt/streunding

# 5. Productie-env klaarzetten (zie env.production.example in deze map)
sudo -u streunding cp deploy/env.production.example .env.production
sudo -u streunding nano .env.production   # vul de echte waarden in

# 6. Eerste build
sudo -u streunding npm ci
sudo -u streunding npm run build

# 7. systemd-service installeren
sudo cp deploy/streunding.service /etc/systemd/system/streunding.service
sudo systemctl daemon-reload
sudo systemctl enable --now streunding

# 8. Caddy config installeren
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy regelt zelf het Let's Encrypt-certificaat voor `streunding.nl` zodra
DNS klopt en poort 80/443 bereikbaar zijn (open die in de Strato-firewall
als daar een aparte firewall-instelling voor is).

## Updaten (elke volgende deploy)

```bash
sudo -u streunding /opt/streunding/deploy/deploy.sh
```

Dit doet `git pull`, `npm ci`, `npm run build` en herstart de service.
Let op: `.env.production` staat buiten git (net als `.env.local` nu) — die
overleeft een `git pull` gewoon, hoeft niet opnieuw ingevuld te worden.

## Logs / status

```bash
sudo systemctl status streunding
sudo journalctl -u streunding -f
```
