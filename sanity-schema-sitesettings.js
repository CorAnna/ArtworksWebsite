export default {
    name: 'sitesettings',
    title: 'Gestione Pagine Sito',
    type: 'document',
    fields: [
        // ── SEZIONE HEADER & FOOTER ──
        {
            name: 'artistName',
            title: 'Nome Artista (Header/Footer)',
            type: 'string',
            fieldset: 'generali'
        },

        // ── SEZIONE HERO ──
        {
            name: 'heroTitleLine1',
            title: 'Hero Titolo - Riga 1',
            type: 'string',
            fieldset: 'hero'
        },
        {
            name: 'heroTitleLine2Italic',
            title: 'Hero Titolo - Riga 2 (In Corsivo Dorato)',
            type: 'string',
            fieldset: 'hero'
        },
        {
            name: 'heroTitleLine3',
            title: 'Hero Titolo - Riga 3',
            type: 'string',
            fieldset: 'hero'
        },
        {
            name: 'heroSub',
            title: 'Hero Sottotitolo (Frase d\'impatto)',
            type: 'string',
            fieldset: 'hero'
        },

        // ── SEZIONE CHI SONO (ABOUT) ──
        {
            name: 'aboutTitle',
            title: 'Titolo Chi Sono',
            type: 'string',
            fieldset: 'about'
        },
        {
            name: 'aboutBody',
            title: 'Biografia (Testo)',
            type: 'text',
            fieldset: 'about'
        },
        {
            name: 'aboutImage',
            title: 'Foto Profilo o Studio',
            type: 'image',
            options: { hotspot: true },
            fieldset: 'about'
        },
        {
            name: 'statArtworks',
            title: 'Statistica: Opere Create',
            type: 'number',
            fieldset: 'about'
        },
        {
            name: 'statExhibitions',
            title: 'Statistica: Esposizioni',
            type: 'number',
            fieldset: 'about'
        },
        {
            name: 'statYears',
            title: 'Statistica: Anni di Attività',
            type: 'number',
            fieldset: 'about'
        },

        // ── SEZIONE CONTATTI ──
        {
            name: 'contactTitle',
            title: 'Titolo Sezione Contatti',
            type: 'string',
            fieldset: 'contact'
        },
        {
            name: 'contactSub',
            title: 'Sottotitolo Contatti',
            type: 'string',
            fieldset: 'contact'
        },

        // ── SEZIONE LINKS SOCIAL ──
        {
            name: 'instagramUrl',
            title: 'Link Instagram',
            type: 'url',
            fieldset: 'social'
        },
        {
            name: 'behanceUrl',
            title: 'Link Behance',
            type: 'url',
            fieldset: 'social'
        }
    ],

    // Raggruppa i campi in schede per non fare confusione nella Dashboard
    fieldsets: [
        { name: 'generali', title: 'Impostazioni Generali' },
        { name: 'hero', title: 'Sezione Hero (Inizio)' },
        { name: 'about', title: 'Sezione Chi Sono' },
        { name: 'contact', title: 'Sezione Contatti' },
        { name: 'social', title: 'Link Social (Footer)' }
    ]
}
