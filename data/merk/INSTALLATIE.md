# Streunding — merk in de site zetten

Vier stappen, allemaal in jouw bestaande Next.js + Tailwind-opzet.

## 1. Fonts erbij — `src/app/layout.tsx`

Je laadt nu alleen Geist. Zet Cormorant Garamond en Lora ernaast (Geist mag
blijven voor de UI):

```tsx
import { Geist, Geist_Mono, Cormorant_Garamond, Lora } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
  variable: "--font-heading",
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
  variable: "--font-body",
});
```

En op `<html>`:

```tsx
className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${lora.variable} h-full antialiased`}
```

In `globals.css` staat nog `font-family: Arial, Helvetica, sans-serif` op
`body` — zet die op Lora, dan zit het merk ook in de lopende tekst:

```css
body {
  font-family: var(--font-body), Georgia, serif;
}
```

## 2. Favicon en app-icoon

`src/app/icon.svg` is nu de 🐝-emoji. Vervang die en zet het Apple-icoon erbij:

```
merk/icon.svg        →  src/app/icon.svg
merk/apple-icon.svg  →  src/app/apple-icon.svg
```

Next.js pakt die bestandsnamen automatisch op — geen `<link>` nodig.
`src/app/favicon.ico` mag weg (of laat staan als fallback; `icon.svg` wint).

## 3. Het logo in de nav — `src/components/Nav.tsx`

Zet `merk/Logo.tsx` in `src/components/Logo.tsx`. In `Nav.tsx` vervang je
de emoji-regel:

```tsx
// weg:
<Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2 hover:text-amber-300 transition-colors" onClick={() => setOpen(false)}>
  🐝 <span>Streunding</span>
</Link>

// nieuw:
<Link href="/" aria-label="Streunding Imkerij" className="transition-opacity hover:opacity-80" onClick={() => setOpen(false)}>
  <Logo tone="dark" size={30} />
</Link>
```

Plus bovenaan `import Logo from "@/components/Logo";`.

De nav is `bg-amber-900` — dus altijd `tone="dark"`. Elders:

| Plek | Props |
| --- | --- |
| Nav | `tone="dark" size={30}` |
| Hero / homepage | `size={72} tagline` |
| Footer (donker) | `tone="dark" size={36} tagline` |
| Alleen het teken | `import { Korf } from "@/components/Logo"` |

Het merkteken is SVG, de naam echte tekst — altijd scherp, selecteerbaar
en vindbaar voor Google.

## 4. De homepage — `src/app/page.tsx`

```
merk/Hero.tsx       →  src/components/Hero.tsx
merk/page.tsx       →  src/app/page.tsx        (vervangt de hele homepage)
merk/hero-kast.jpg  →  public/hero-kast.jpg
merk/zwerm.jpg      →  public/zwerm.jpg
merk/mede.jpg       →  public/mede.jpg
```

`page.tsx` houdt je Supabase-query voor het aantal kasten (valt terug op 2
als de query niets geeft). Wat erin veranderd is t.o.v. nu:

- Alle emoji eruit — 🍯 👨‍🌾 🪵 ❤️ 🐝. Nummers, hairlines en foto's doen het werk,
  dus je hebt geen icoonset nodig.
- De statistiekenband: drie échte feiten (kasten · 3e mede · 2027) in plaats
  van zeven, zonder ∞ en ❤️.
- Kaarten met hairline-kaders en genummerde kickers; geen gradiënttegels.
- Nieuw: de zwerm als volle plaat met een regel eroverheen, en een sectie
  over Oma's Appeltjes.
- Tijdlijn met jaartallen in de kantlijn (tabulaire cijfers), geen bubbels.
- `font-black` en `rounded-full` zijn overal weg; knoppen zijn outline.

## 5. Nav en footer

```
merk/Nav.tsx     →  src/components/Nav.tsx
merk/Footer.tsx  →  src/components/Footer.tsx
```

De nav is nu licht met een hairline in plaats van de amber-900 balk, met het
logo links en een goudstreep onder de actieve link. Meegenomen qua
toegankelijkheid: `aria-expanded` + `aria-controls` op de hamburger,
`aria-current="page"` op de actieve link, een echt `aria-label` op de
logo-link, en een `:focus-visible`-ring op alles wat klikbaar is. Het
mobiele menu klapt nu open onder `lg` (je hebt negen links — op tablet
werden die te krap).

## 6. Stijlen — `src/app/globals.css`

`merk/globals.css` vervangt de bovenkant van je bestaande bestand: `body`
staat niet meer op Arial, er zijn merk-variabelen (`--gold`, `--ink`, …), één
globale `:focus-visible`-stijl, een `::selection`-tint en een `.plate`-klasse
voor foto's. **Je `@keyframes`, `.animate-*` en `.reveal`-regels staan er
niet in — plak die eronder.**

## 7. Banners

```
merk/og-image.png  →  public/og-image.png
```

Die ontbrak; je `layout.tsx` verwijst er al naar (1200 × 630), dus elke
share van je site was tot nu toe een kale link.

Nog niet geëxporteerd — zeg het als je ze wilt:

- Social banner 1584 × 396 (LinkedIn) en e-mailsignatuur 600 × 120.
- Advertenties 300 × 250, 728 × 90, 160 × 600.

## 8. Bestuiving — `src/app/bestuiving/`

```
merk/bestuiving/page.tsx        →  src/app/bestuiving/page.tsx
merk/bestuiving/TierCard.tsx    →  src/app/bestuiving/TierCard.tsx
merk/bestuiving/AanbodCard.tsx  →  src/app/bestuiving/AanbodCard.tsx
```

`tiers.ts` en `actions.ts` blijven zoals ze zijn — `useActionState`,
`createTierAanvraag` en `createAanvraag` zijn niet aangeraakt, alleen de
opmaak. Wat anders is: de ✓-vinkjes zijn goudlijntjes, prijzen staan in
Cormorant met tabulaire cijfers, de "uitverkocht"-badge is een outline-label
in plaats van rood, en de formuliervelden hebben labels in klein kapitaal met
een goud-focusring. De hero gebruikt `/hero-kast.jpg`.

## 9. Over mij — `src/app/over-mij/`

```
merk/over-mij/page.tsx  →  src/app/over-mij/page.tsx
merk/ContactForm.tsx    →  src/components/ContactForm.tsx
```

De 👨‍🌾-avatar is weg; er staat nu een plaat met de mede op de bar
(`/mede.jpg`). De vier cijfers zijn een hairline-lijst geworden in plaats van
de amber-band, het verhaal is één gejustificeerde kolom met een pull-quote,
en de tijdlijn is dezelfde vorm als op de homepage. `ContactForm` doet nog
precies hetzelfde (mailto), alleen anders opgemaakt — en het
e-mailadres staat niet meer als tekst op de pagina.

Regio is **Oldambt, Groningen**.

## 10. Informatief — `src/app/informatief/page.tsx`

```
merk/informatief/page.tsx  →  src/app/informatief/page.tsx
```

Alle emoji eruit (👑 🐝 🪲 🥚 🌸 💧 en de vier seizoenskleuren). In plaats van
zes losse kaartjes staat er nu een specimentabel — rol, aantal, levensduur,
taak — met de cijfers in tabulaire Cormorant. De broedcyclus was verstopt in
één kaartje en is nu een eigen 21-daagse reeks. De seizoenen staan op donker
met maanden en volksgrootte erbij. Inhoudsopgave in de hero linkt naar de
vier secties (`#volk`, `#oogst`, `#seizoenen`, `#tips`).

## 11. Kalender — `src/app/kalender/`

```
merk/kalender/page.tsx  →  src/app/kalender/page.tsx
merk/Kalender.tsx       →  src/components/Kalender.tsx
```

De maandkiezer is een strip van twaalf over de volle breedte in plaats van een
grid met pillen; de huidige maand krijgt "Nu". Prioriteit is lijnzwaarte
geworden in plaats van rood/geel/groene bolletjes — dikke rode streep voor
"moet nu", gouden hairline voor "let op", grijs voor achtergrond — met een
legenda. Per maand zijn **dracht** en **kast openen** toegevoegd; onderaan
staat het hele jaar als tabel, ook klikbaar.

## 12. Dagboek — `src/app/dagboek/page.tsx`

```
merk/dagboek/page.tsx  →  src/app/dagboek/page.tsx
```

Beide toestanden zijn opnieuw gedaan. De **lege** toestand is nu een blanco
inspectieblad met lijnen die nog ingevuld moeten worden, naast de wachtlijst
(2 kasten, 0 volken, voorjaar 2027) — in plaats van 🪵 met een gestippeld
kader. De **gevulde** toestand is een ruled tabel in plaats van een tijdlijn
met 🔍-bollen: datum, volk, koningin, broedbeeld, varroa, notitie. Dezelfde
Supabase-queries als eerst.

## 13. Kasten — `src/app/kasten/page.tsx`

```
merk/kasten/page.tsx  →  src/app/kasten/page.tsx
merk/kast-b.jpg       →  public/kast-b.jpg
```

Nieuw: een **specificatietabel** op donker (hout 22 mm, raatafstand 8–9 mm,
10 broedramen, hoeken 45°). Die maten zaten verstopt in de stappentekst,
terwijl ze het bewijs zijn dat je weet waar je mee bezig bent. `gebouwd`
leest nu een jaarbereik uit de database (2025–2026 als fallback).

## 14. Honing — `src/app/honing/page.tsx`

```
merk/honing/page.tsx  →  src/app/honing/page.tsx
```

Deze pagina was helemaal toekomstmuziek. Ik heb je brouwlogs uit
`data/mede/` gelezen en er een **brouwregister** van gemaakt: batch 26244
(braggot, 11 jun, 20 L, 4,5 kg honing), 26322 (appelmede, 11 aug) en 26332
(Oma's Appelmede, 18 aug), elk met status en een notitie uit je eigen log. De
kop is nu eerlijk: *nog geen eigen honing, wel al drie brouwsels*.

De batchgegevens staan **hard in het bestand**. Wil je ze uit `data/mede/`
of uit Supabase laten komen, zeg het dan — dan maak ik er een loader van.

## Nog open

- **De zwermfoto is geen eigen foto** (mangoboom — niet Nederlands). Sterk
  beeld, maar als je een eigen zwerm hebt, wisselen we hem.
- **Blog-index en artikelpagina** staan nog in de oude stijl — dat is de laatste.
- `src/app/icon.svg` had de 🐝-emoji; die zit nu in stap 2.

## Kleuren

| Rol | Op licht | Op donker |
| --- | --- | --- |
| Goud (accent) | `#b68235` | `#e1ad66` |
| Tekst | `#201f1d` | `#f3f2f2` |
| Ondergrond | `#f3f2f2` | `#1a1917` |

Goud op licht haalt 3:1 — genoeg voor lijnen, iconen en grote tekst, niet
voor lopende tekst; gebruik daar `#7d5411`. Je huidige `--background`
`#fffbeb` (amber-50) is warmer dan de `#f3f2f2` van het merk; beide werken,
maar kies er één en houd hem vast.
