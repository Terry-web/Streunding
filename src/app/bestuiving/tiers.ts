export type Tier = {
  id: "tuin" | "boomgaard" | "teelt" | "maatwerk";
  titel: string;
  intro: string;
  beschrijving: string;
  punten: string[];
  ctaLabel: string;
  doelgroep: "particulier" | "zakelijk";
  gewasVelden: boolean;
};

export const tiers: Tier[] = [
  {
    id: "tuin",
    titel: "Bestuifvolk voor tuin & kleine boomgaard",
    intro: "Voor particulieren, moestuinen en kleinere boomgaarden.",
    beschrijving:
      "Een sterk bijenvolk op locatie voor een optimale bestuiving van bloeiende planten en fruitbomen.",
    punten: [
      "Geschikt voor tuinen, moestuinen en kleine boomgaarden",
      "Gezonde en sterke bestuifvolken",
      "Lokale levering en plaatsing",
      "Flexibele inzet tijdens de bloeiperiode",
    ],
    ctaLabel: "Vraag een bestuifvolk aan",
    doelgroep: "particulier",
    gewasVelden: false,
  },
  {
    id: "boomgaard",
    titel: "Bestuifvolk voor boomgaard",
    intro: "Speciaal voor fruittelers die tijdens de bloei extra bestuivingskracht nodig hebben.",
    beschrijving:
      "Meer bijen op het juiste moment zorgt voor een betere bestuiving en een goede basis voor een gelijkmatige vruchtzetting.",
    punten: [
      "Geschikt voor appel, peer, kers, pruim en ander fruit",
      "Inzet afgestemd op de bloeiperiode",
      "Meerdere volken mogelijk",
      "Geschikt voor zowel kleine als grotere boomgaarden",
    ],
    ctaLabel: "Bestuiving aanvragen",
    doelgroep: "zakelijk",
    gewasVelden: true,
  },
  {
    id: "teelt",
    titel: "Bestuiving voor teelt & gewassen",
    intro: "Voor telers die betrouwbare bestuiving nodig hebben tijdens een belangrijke bloeiperiode.",
    beschrijving:
      "Wij leveren bestuifvolken afgestemd op het gewas, de oppervlakte en de bloeiperiode.",
    punten: [
      "Voor diverse bloeiende gewassen",
      "Aantal volken afgestemd op de teelt",
      "Planning rondom de bloei",
      "Geschikt voor open teelt en specifieke teeltsituaties",
    ],
    ctaLabel: "Vraag een offerte aan",
    doelgroep: "zakelijk",
    gewasVelden: true,
  },
  {
    id: "maatwerk",
    titel: "Bestuiving op maat",
    intro: "Een oplossing voor grotere percelen, professionele teelt of situaties waarin maatwerk nodig is.",
    beschrijving:
      "Van enkele volken tot een complete bestuivingsplanning: we denken met je mee over wat jouw teelt nodig heeft.",
    punten: [
      "Persoonlijk advies",
      "Afstemming op oppervlakte en gewas",
      "Planning van plaatsing en ophalen",
      "Mogelijkheid tot meerdere bijenvolken",
    ],
    ctaLabel: "Bespreek jouw situatie",
    doelgroep: "zakelijk",
    gewasVelden: true,
  },
];
