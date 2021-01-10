CMS.registerEditorComponent({
    id: 'img',
    label: 'Img',
    fields: [
        {
            name: 'src',
            label: 'Image',
            widget: 'image'
        },
        {
            name: 'alt',
            label: 'Description de l\'image',
            widget: 'string'
        },
        {
            name: 'hideCaption',
            label: 'Cacher la légende ?',
            widget: 'boolean',
            default: false,
            required: false
        }
    ],
    pattern: /{{< img src="([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:";'< >?,.\/]+)" alt="([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:";'< >?,—.@\/]+)" (hideCaption=(true|false) )?>}}/,
    fromBlock: function (match) {
        return {
            src: match[1],
            alt: match[2],
            hideCaption: match[3],
        };
    },
    toBlock: function (obj) {
        if (obj.src) {
            return `{{< img loading="lazy"  src="${obj.src}" alt="${obj.alt}" hideCaption=${obj.hideCaption} >}}`;
        }
        return '<< Élément incomplet >>'
    },
    toPreview: function (obj) {
        if (obj.src) {
            if (obj.hideCaption === true) {
                return `<figure><img loading="lazy"  src="/${obj.src}" alt="${obj.alt}"></figure>`;
            }

            return `<figure><img loading="lazy"  src="/${obj.src}" alt="${obj.alt}"><figcaption>${obj.alt}</figcaption></figure>`;
        }
        return '<< Élément incomplet >>'
    }
});
