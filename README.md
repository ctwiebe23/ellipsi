# Description

`Ellipsi` is a simple JavaScript library used to create HTML tags
programmatically.

```js
const MyButton = button(
  'Click me!',                         // Add child elements,
  on('click', () => alert('Clicked')), // event listeners,
  { id: 'my-button' },                 // and attributes.
)
```

# Using Ellipsi

`Ellipsi` has one primary function: `tag(name, ...children)`.  This function
is used to create elements of the type `HTMLElement` with a clean syntax.

```js
const Heading = tag('h1', 'Tutorial')
// -> <h1>Tutorial</h1>
```

Shortcuts are provided for most HTML elements, in the form:

```js
// Shortcut function:
const h1 = (...x) => tag('h1', ...x)
// Using shortcut:
const Heading = h1('Tutorial')
// -> <h1>Tutorial</h1>
```

Since this a common pattern, there is a helper function provided:

```js
const h1 = shortTag('h1')
const Heading = h1('Tutorial')
// -> <h1>Tutorial</h1>
```

---

Many different things can be passed to `tag` as children --- text, attributes,
event handlers, other tags, and arrays.

```js
const MyTextInput = input({ id: 'my-text-input' })
// -> <input id="my-text-input"></input>

const MyForm = form(
  label('Write your name:', { for: MyTextInput.id }),
  MyTextInput,
  button(
    'Greet',
    { type: 'button' },
    on('click', () => alert('Hello, ' + MyTextInput.value))
  ),
)
// -> <form>
//      <label for="my-text-input">Write your name</label>
//      <input id="my-text-input"></input>
//      <button type="button">Greet</button>
//    </form>
```

# Installing Ellipsi

Install the library using `npm` with:

    npm install ellipsi

Then, in your JavaScript module:

```js
import { tag, on, h1, p /* et cetera */ } from 'ellipsi'
```

Alternatively, download the library directly from
[here](https://raw.githubusercontent.com/ctwiebe23/ellipsi/refs/heads/main/ellipsi.js)
and link to it locally.

# Function Reference

## `tag(name, ...children)`

While the `name` of the tag should be a string, the `children` given to `tag`
can be of many different types.  These will be handled as such:

1.  `HTMLElement`: Attached to the new tag as a child.
2.  `Attr`: Cloned and attached to the new tag as an attribute.
2.  `EventListener`: Attached to the new tag using
    `HTMLElement.addEventListener()`.
1.  `Shadow`: Attached to the new tag using
    `HTMLElement.attachShadow({ mode: 'open' })`.
2.  `Object`: Parsed as a collection of key/value pairs representing
    attributes (e.g. `{ id: 'my-id', class: 'my-class' }`).
3.  `Array`: Looped through and handled same as other children.
4.  All else will be converted to `Text` and attached to the new tag as a
    child.

> [!WARNING]
>
> `tag` does not clone the `HTMLElement`s passed to it --- attaching the same
> one multiple times will simply move it around.
>
> ```js
> // Improper reusable component:
> const MyName = span('Checksum', { class: 'fancy' })
>
> const AboutMe = section(
>   h1('About ', MyName), // Name will not appear here
>   p('Heya!  I am ', MyName), // Instead, it will be moved here
> )
> ```
>
> The above results in:
>
> ```html
> <section>
>   <h1>About </h1>
>   <p>Heya! I am <span class="fancy">Checksum</span></p>
> </section>
> ```
>
> An `HTMLElement` can be cloned with `HTMLElement.cloneNode(true)`, though
> this does *not* preserve event listeners, and so is often bad practice.
>
> It is best to turn reusable components into functions that return a new
> element entirely.  Reserve constant elements for times when you intend to be
> referencing an exact instance of an element in different places, such as an
> input in a form who's value will be used later.
>
> ```js
> // Proper reusable component:
> const MyName = () => span('Checksum', { class: 'fancy' })
>
> const AboutMe = section(
>   h1('About ', MyName()), // Unique element
>   p('Heya!  I am ', MyName()), // Unique element
> )
> ```
>
> The above results in:
>
> ```html
> <section>
>   <h1>About <span class="fancy">Checksum</span></h1>
>   <p>Heya! I am <span class="fancy">Checksum</span></p>
> </section>
> ```

## `on(types, callback)`

`EventListener`s can be created using the `on(types, callback)` function, and
can be attached to `HTMLElement`s via `tag`.
`types` is a string representing the triggering event name(s) separated by
spaces, and `callback` is the callback function that takes one (optional)
argument:  The triggering `Event`.

```js
// Ellipsi code:
const UserInputForm = form(FormContent, on('click keydown', handleInput))
// Equivalent js code:
const UserInputForm = document.createElement('form')
UserInputForm.replaceChildren(...FormContent)
UserInputForm.addEventListener('click', handleInput)
UserInputForm.addEventListener('keydown', handleInput)
```

## `shortTag(name, ...x)`

Shortcut functions can be created using the `shortTag(name, ...x)` function,
and then can be used to create `HTMLElement`s using the `tag` function
indirectly.

```js
// Creating shortcuts:
const h1 = shortTag('h1')
const checkbox = shortTag('input', { type: 'checkbox' })
// Using shortcuts:
const Heading = h1('Tutorial')
// -> <h1>Tutorial</h1>
const UserInput = checkbox({ id: 'user-input', checked: '' })
// -> <input type="checkbox" id="user-input" checked=""></input>
```

## `attr(key, value)`

If you don't like JavaScript Object Notation or need to use JavaScript's
built-in `Attr` class to represent your HTML attributes, `attr` is provided
as shorthand.

```js
// Ellipsi code:
const Link = a(
  'The wisdom of Georg',
  attr('href', 'https://www.spidersge.org'),
)
// Equivalent js code:
const href = document.createAttribute('href')
href.value = 'https://www.spidersge.org'
const Link = document.createElement('a')
Link.appendChild(document.createTextNode('The wisdom of Georg'))
Link.setAttributeNode(href.cloneNode())
```

> [!NOTE]
>
> You can also use JSON to append attritubes instead of the `attr`
> function.
>
> ```js
> // Ellipsi code (with JSON attributes):
> const Link = a(
>   'The wisdom of Georg',
>   { href: 'https://www.spidersge.org' },
> )
> ```

## `shadow(...components)`

> [!WARNING]
>
> Shadow roots are what I would consider an "advanced topic" for most users.
> They may be difficult to use with this library, because this library stays
> very true to their default behavior and their default behavior is difficult
> to use.

`Shadow`s can be created using the `shadow(...components)` function, and can be
attached to `HTMLElement`s via `tag`.  This
function is similar to the `tag` function in that it takes many different
types (and handles them in the same way), but differs in that shadow roots can
have their own stylesheets (`CSSStyleSheet`s) and
can*not* have attributes or event listeners.  Attributes and event listeners
should be attached to whatever host element the shadow root is attached to.

```js
const documentStyles = tag('style',
  'p { color: red; }'
)

const shadowStyles = tag('style',
  'p { font-weight: bold; }'
)

document.head.appendChild(documentStyles)
document.body.replaceChildren(
  p('I am not in the shadow DOM or in the slot'),
  span(
    p('I am not in the shadow DOM, but *am* in the slot'),
    // As is normal shadow root behavior, the shadow will
    // override non-shadow elements.  Non-shadow elements
    // will be hidden unless they are placed in a slot
    shadow(
      shadowStyles,
      p('I am in the shadow DOM before the slot'),
      slot(),
      p('I am in the shadow DOM after the slot'),
    ),
  ),
)
```

The above results in:

```html
<p>I am not in the shadow DOM or in the slot</p>
<span>
  #shadow-root (open)
    <p>I am in the shadow DOM before the slot</p>
    <slot>
      <p>I am not in the shadow DOM, but *am* in the slot</p>
    </slot>
    <p>I am in the shadow DOM after the slot</p>
</span>
```

# See Also

- [Source code](https://github.com/ctwiebe23/ellipsi)
- [Online README](https://ctwiebe23.github.io/ellipsi)
- [CHANGELOG](https://ctwiebe23.github.io/ellipsi/changelog)
