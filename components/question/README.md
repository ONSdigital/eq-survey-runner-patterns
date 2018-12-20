## Rationale

The question pattern provides a consistent presentation of an eQ question (or questions), serving a variety of answer types, allowing the user to submit their answer(s) in a single page view.

## Usage

Questions are comprised of:

### Question subtitle (optional)

Used to display either a meaningful sub-heading, the [section](/components/detail/vertical-navigation) the question is part of, or conditional routing information from the previous question(s), e.g. 'You answered x'.

### Question number (optional)

Use to display the order number of the question in a linear questionnaire (with no routing).

### Question title

Use to display the question being asked.

### Question description (optional)

Use to expand on the question with more detail.

### Question [definition](/components/detail/definition) (optional)

Use to define a term displayed in the question that users are not likely to easily understand, e.g. 'What is central heating?'

### Question guidance (optional)

Use to help the user understand how to answer the question, i.e. what information to include/exclude fro their answer.

### Answer

Display the appropriate form elements required to answer this question, e.g. [Mutually exclusive checkboxes](9/components/detail/mutually-exclusive--checkboxes)

## Variants

### Single

This is used to present a single question with a single answer. You can display multiple questions on a single page.

### Repeating answer

This is used to present the user with a single question that may require multiple answers.  The user can manually add or remove multiple answers of the same type. Use the modifier `question--repeating` on the question markup when implementing a repeating answer.
