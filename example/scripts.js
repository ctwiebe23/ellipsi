import { tag, on, shadow, shortTag, p, h2 } from '../ellipsi.js'

// Create shortcuts with shortTag
const Para = shortTag('p')
// JSON-style objects become HTML attributes
const FormButton = shortTag('button', { type: 'button' })

// Create styles to apply to a shadow root
const shadowStyles = tag('style',
  'p { color: red; }'
)

// Create form inputs
const NameInput = tag('input', { type: 'text', placeholder: 'Your name...' })
// Use on to create event listeners
const ShowNameButton = FormButton('Greet', on('click', () => alert('Hello, ' + NameInput.value)))

const Doc = [
  tag('h1', 'Ellipsi Demo'),
  tag('p', 'Create elements with the ', tag('code', 'tag'), ' function.'),
  Para(
    'Define shortcuts for common elements with ',
    tag('code', 'shortTag'),
    '.'
  ),
  p('Or, use built in shortcuts for common tags.'),

  h2('Using event listeners'),
  tag('form',
    NameInput,
    ShowNameButton,
  ),

  h2('Using the Shadow DOM'),
  p('I am in no way related to a shadow!'),
  tag('span',  // The parent of the shadow
    p('I am not in the shadow DOM, but *am* in a slot.'),
    // As is normal shadow root behavior, the shadow will
    // override non-shadow elements.  Non-shadow elements
    // will be hidden unless they are placed in a slot
    shadow(
      shadowStyles,
      p('I am in the shadow DOM before the slot.'),
      tag('slot'),
      p('I am in the shadow DOM after the slot.'),
    ),
  ),
]

// Run after the page has loaded.
const main = () => {
  document.body.replaceChildren(...Doc)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main)
} else {
  main()
}