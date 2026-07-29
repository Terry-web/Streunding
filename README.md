# Imkerij Streunding

Deze repository bevat een eenvoudige website voor Imkerij Streunding, plus een begin van een Supabase-ondersteunde opzet voor klanten, locaties en boekingen.

## Projectoverzicht

- Websitebestanden: index.html, about.html, apiary.html, zwerm.html, contact.html, thank-you.html, css/styles.css en contact.php
- Supabase SQL-schema: supabase/install.sql
- Extra documentatie: docs/bedrijfsplan.md

## Website setup

1. Plaats de websitebestanden op je webserver.
2. Zorg dat de map images aanwezig is naast index.html.
3. Voeg de volgende bestanden toe als je ze wilt gebruiken:
   - images/zwerm.jpg
   - images/kast.jpg
   - images/ai.jpg
4. De pagina's zwerm.html, index.html en apiary.html tonen automatisch de afbeeldingen als deze bestanden aanwezig zijn.

## Contactformulier

- Het formulier maakt gebruik van contact.php.
- Zorg dat PHP actief is op je hostingomgeving.
- Pas het e-mailadres in contact.php aan als dat nodig is.
- Als mail() niet werkt, overweeg een robustere oplossing zoals PHPMailer of SMTP.

## Deploying

- Upload de bestanden naar je webruimte via FTP of een vergelijkbare methode.
- Voor Strato is een map zoals htdocs of public_html meestal geschikt.

## Extra documentatie

- Zie docs/bedrijfsplan.md voor het zakelijke bedrijfsplan.
- Zie supabase/install.sql voor de huidige database-opzet.

