// ============================================================
//  SCHEMA SANITY — artwork.js
//  Inserisci questo file in:
//    sanity-studio/schemas/artwork.js
//  Poi importalo in schemas/index.js
// ============================================================

export default {
  name: 'artwork',
  title: 'Opera d\'arte',
  type: 'document',

  // Icona nel pannello di Sanity Studio
  icon: () => '🎨',

  fields: [
    {
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(120),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Pittura',  value: 'pittura'  },
          { title: 'Scultura', value: 'scultura' },
          { title: 'Disegno',  value: 'disegno'  },
          { title: 'Altro',    value: 'altro'    },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'image',
      title: 'Immagine principale',
      type: 'image',
      options: { hotspot: true },  // abilita il punto focale per il crop
      validation: Rule => Rule.required(),
      fields: [
        {
          name: 'alt',
          title: 'Testo alternativo (accessibilità)',
          type: 'string',
          options: { isHighlighted: true },
        },
      ],
    },
    {
      name: 'images',
      title: 'Galleria (immagini aggiuntive)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Testo alternativo', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'year',
      title: 'Anno',
      type: 'number',
      validation: Rule => Rule.integer().min(1900).max(new Date().getFullYear()),
    },
    {
      name: 'technique',
      title: 'Tecnica',
      type: 'string',
      placeholder: 'es. Olio su tela, Acquerello, Bronzo…',
    },
    {
      name: 'size',
      title: 'Dimensioni',
      type: 'string',
      placeholder: 'es. 80 × 100 cm',
    },
    {
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      rows: 4,
    },
    {
      name: 'available',
      title: 'Disponibile per l\'acquisto',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'price',
      title: 'Prezzo (€)',
      type: 'number',
      hidden: ({ document }) => !document?.available,
    },
    {
      name: 'featured',
      title: 'In evidenza',
      description: 'Mostra tra le opere principali',
      type: 'boolean',
      initialValue: false,
    },
  ],

  // Ordinamento di default nel pannello
  orderings: [
    {
      title: 'Anno (più recente)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Titolo A→Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],

  // Anteprima nel pannello
  preview: {
    select: {
      title:    'title',
      subtitle: 'category',
      media:    'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : '',
        media,
      };
    },
  },
};
