module.exports = {
  title: 'Accordion',
  status: 'ready',
  default: 'accordion',
  preview: '@preview__full-width',
  collated: true,
  'variants': [{
    'label':'Accordion',
    'name':'accordion',
  }, {
    'label':'Accordion controls',
    'name':'accordion-controls',
    'context': {
      'show_all': true
    }
  }, {
    'label':'Accordion (panels)',
    'name':'accordion-panels',
    'context': {
      'complex': true,
      'contained_accordion': [
        {
          accordion_heading: "066 Sand&Gravel for 49900000118",
          caption: "Surveys"
        },
        {
          accordion_heading: "073 BLOCKS for 49900000118",
          caption: "Surveys"
        },
        {
          accordion_heading: "074 BRICKS for 49900000118",
          caption: "Surveys"
        }
      ]
    }
  }]
};
