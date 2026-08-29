# Sprint A — Merk in de site (streunding.nl)

Doel: het merk (typografie, logo, hero, kleuren) doorvoeren in de bestaande Next.js + Tailwind-opzet.

## A1. Typografie fundament
- Cormorant Garamond + Lora toevoegen naast Geist in `src/app/layout.tsx`
- `body` font-family in `globals.css` naar Lora
- **Check:** nav/UI blijft Geist, lopende tekst en koppen tonen het nieuwe font

## A2. Favicon & app-icoon
- `merk/icon.svg` → `src/app/icon.svg`
- `merk/apple-icon.svg` → `src/app/apple-icon.svg`
- `favicon.ico` weg of laten staan als fallback
- **Check:** tab-icoon en "toevoegen aan beginscherm" op iOS t onen het nieuwe icoon

## A3. Logo in de navigatie
- `merk/Logo.tsx` → `src/components/Logo.tsx`
- Emoji-regel in `Nav.tsx` vervangen door `<Logo tone="dark" size={30} />`
- **Check:** logo rendert scherp op alle breakpoints, `aria-label` aanwezig, geen console warnings

## A4. Hero component
- `merk/Hero.tsx` → `src/components/Hero.tsx`
- `merk/hero-kast.jpg` → `public/hero-kast.jpg`
- Oude hero-blok in `page.tsx` vervangen door `<Hero />`
- Page-wrapper achtergrond van `bg-amber-50` naar `#f3f2f2`
- **Check:** hero laadt met logo (`size={72} tagline`), geen layout-shift onder de fixed nav

## A5. Kleuren consolideren
- `--background` amber-50 vs merk `#f3f2f2` — één kiezen en doorvoeren
- Lopende tekst op goud-accent: `#7d5411` i.p.v. `#b68235` (contrast)
- **Check:** geen amber-50/f3f2f2 mix meer in de codebase

## A6. Stats/kaarten/tijdlijn meetrekken
- Gradients eruit, hairlines + outline-knoppen conform het hero-systeem
- `font-black`/`rounded-full` afstemmen op de rest
- **Check:** geen gradient-classes meer in stats-sectie, kaarten en tijdlijn; visueel één lijn met de hero

## A7. Banners
- `/og-image.png` (1200×630) exporteren en in `public/` zetten — `layout.tsx` verwijst er al naar
- Social banner (1584×396) en e-mailsignatuur (600×120) als afbeeldingen aanleveren
- Advertenties (300×250, 728×90, 160×600) als PNG voor `public/`
- **Check:** og-image laadt correct bij het delen van een link (bv. via een OG-preview tool)

## Kleurreferentie

| Rol | Op licht | Op donker |
| --- | --- | --- |
| Goud (accent) | `#b68235` | `#e1ad66` |
| Tekst | `#201f1d` | `#f3f2f2` |
| Ondergrond | `#f3f2f2` | `#1a1917` |

Goud op licht haalt 3:1 contrast — genoeg voor lijnen, iconen en grote tekst, niet voor lopende tekst (daar `#7d5411`).
