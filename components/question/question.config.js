module.exports = {
  title: 'Question',
  collated: false, // Pulls all variants into one summary
  status: 'wip',
  variants: [
    {
      name: 'default',
      label: 'Single',
      context: {
        section_title: 'Household energy supply',
        question_id: 'central-heating-question',
        question_number: '1',
        question_title: 'What type of central heating does this household have?',
        question_description: 'This is any central heating supply connected to the single household at the given address.',
        definition_title: 'What is central heating?',
        definition_description: 'Central heating is a central system that generates heat for multiple rooms.',
        question_guidance: 'Select all that apply, whether or not you use it.',
        fieldset_legend: 'What type of central heating do you have?',
        field_label: 'Select all that apply:',
        or: 'Or',
        options: [
          { option_text: 'Gas', 'option_value': 'gas', 'label_for': 'gas', 'label_text': 'Gas', 'label_inline': true},
          { option_text: 'Electric', 'option_value': 'electric', 'label_for': 'electric', 'label_text': 'Electric', 'label_inline': true},
          { option_text: 'Solid fuel', 'option_value': 'solid-fuel', 'label_for': 'solid-fuel', 'label_text': 'Solid fuel', 'label_inline': true},
          { option_text: 'Other', 'option_value': 'other', 'label_for': 'other', 'label_text': 'Other', 'label_inline': true}
        ],
        or_option_text:'No central heating',
        or_option_value:'no central heating',
        or_deselect_adjective: 'deselected',
        or_deselect_message: 'Selecting this will uncheck all other checkboxes'
      }
    },
    {
      name: 'repeating',
      label: 'Repeating',
      context: {
        repeating_answer: true,
        section_title: 'Occupants',
        question_id: 'number-of-occupants-question',
        question_class: 'question--repeatinganswer',
        question_number: '2',
        question_title: 'Who usually lives here?',
        question_description: 'Add everyone who permanently lives at the property.',
        question_guidance_title: 'Include:',
        question_guidance_list: [
          {item: 'Yourself, if this is your permanent or family home'},
          {item: 'Family members including partners, children and babies born on or before 9 April 2017'},
          {item: 'Students and/or school children who live away from home during term time'},
          {item: 'Housemates, tenants or lodgers'}
        ],
        name_form: [
          {
            answer_field: [
              {
                answer_id: 'household-0-first-name',
                label: 'Textfield',
                label_text: 'First name',
              },
              {
                answer_id: 'household-0-last-name',
                label: 'Textfield',
                label_text: 'Last name',
              }
            ]
          }
        ]
      }
    }
  ]
}