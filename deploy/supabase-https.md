# Supabase (thuis) achter HTTPS

Zelfde probleem als de VPS: `mc.streunding.nl:8000` praat nu plain http.
Caddy ervoor zetten, precies zoals bij de VPS (zie `deploy/README.md`), maar
dan op de Supabase-machine zelf (`192.168.1.117`), met Kong als
achterliggende dienst i.p.v. de Next.js-app.

## 1. Router: poorten doorzetten

- `80` en `443` → `192.168.1.117` (nieuw, voor Caddy)
- `8000` → mag je **dichtzetten** zodra Caddy draait; Kong hoeft dan niet
  meer los bereikbaar te zijn, alleen via Caddy op 443. Kleiner aanvalsoppervlak.

## 2. Caddy installeren op 192.168.1.117

```bash
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy
```

## 3. Caddyfile

`/etc/caddy/Caddyfile`:

```
mc.streunding.nl {
	reverse_proxy 127.0.0.1:8000
}
```

(Pas `127.0.0.1:8000` aan als Kong niet lokaal op die machine draait, of op
een andere poort luistert.)

```bash
sudo systemctl reload caddy
```

Caddy vraagt zelf automatisch een Let's Encrypt-certificaat aan zodra DNS
klopt (dat doet het al — `mc.streunding.nl` wijst al naar dit adres) en
poort 80/443 van buiten bereikbaar zijn.

## 4. Testen

```bash
curl -i https://mc.streunding.nl/rest/v1/
```

Zou nu `401` moeten geven (apikey ontbreekt) — zelfde gedrag als eerder over
http, maar dan met een geldig certificaat. Check ook dat `curl http://mc.streunding.nl:8000/`
niet meer lukt zodra je die poort in de router dichtzet.

## 5. Daarna: env-vars omzetten

Overal waar nu `http://192.168.1.117:8000` of `http://mc.streunding.nl:8000`
staat, wordt dat `https://mc.streunding.nl`:

- Lokaal `.env.local` (dit development-project)
- VPS `.env.production` (zie `deploy/env.production.example`)

Na aanpassen: lokaal `.env.local` gewoon opslaan (dev-server pikt het op);
op de VPS `.env.production` bewerken en de service herstarten
(`sudo systemctl restart streunding`, of gewoon `deploy/deploy.sh` opnieuw
draaien).
