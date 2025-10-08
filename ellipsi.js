/**
 * Creates an HTML tag.  Many helper functions are provided as shortcuts for
 * creating commmon elements.
 * @param {string} name The tag name.
 * @param {...string | HTMLElement | Text | Attr | EventListener | Shadow | Object | Array} children
 * The children of the tag.  Handles different types differently:
 *
 * 1. `HTMLElement`s and `Text`s are appended as is (Not cloned).
 * 2. `Attr`s are cloned and then attached to the tag itself.
 * 3. `EventListener`s are attached to the tag itself.
 * 4. `Shadow`s are attached to the tag itself.
 * 5. `Array`s are iterated through and handled as other children.
 * 4. `Object`s are parsed as JSON objects of HTML attributes and
 *    attached to the tag itself.
 * 5. All else is converted to `Text` and appended to the tag.
 *
 * @returns {HTMLElement} The created HTML tag.
 */
export const tag = (name, ...children) => {
  const htmlTag = document.createElement(name)

  const process = (unprocessedChildren) => {
    for (let i = 0; i < unprocessedChildren.length; i++) {
      const child = unprocessedChildren[i]
      if (child instanceof HTMLElement || child instanceof Text) {
        htmlTag.appendChild(child)
      } else if (child instanceof Attr) {
        handleAttributeNode(htmlTag, child)
      } else if (child instanceof EventListener) {
        htmlTag.addEventListener(child.type, child.callback)
      } else if (child instanceof Shadow) {
        const shadowRoot = htmlTag.attachShadow({ mode: 'open' })
        shadowRoot.adoptedStyleSheets = child.sheets
        for (let k = 0; k < child.children.length; k++) {
          const childChild = child.children[k]
          shadowRoot.appendChild(childChild)
        }
      } else if (child instanceof Array) {
        process(child)
      } else if (child?.constructor === Object) {
        handleAttributeObject(htmlTag, child)
      } else if (child !== null && child !== undefined) {
        htmlTag.appendChild(document.createTextNode(child))
      }
    }
  }

  process(children)
  return htmlTag
}

/**
 * Adds an attribute node to a tag safely.
 * @param {HTMLElement} htmlTag The HTML tag.
 * @param {Attr} attrNode The HTML attribute.
 * @returns {undefined}
 */
const handleAttributeNode = (htmlTag, attrNode) => {
  if (htmlTag.hasAttribute(attrNode.name)) {
    const currentValue = htmlTag.getAttribute(attrNode.name)
    htmlTag.setAttribute(attrNode.name, currentValue + ' ' + attrNode.value)
  } else {
    htmlTag.setAttributeNode(attrNode.cloneNode())
  }
}

/**
 * Adds attributes to a tag from a JSON object.
 * @param {HTMLElement} htmlTag The HTML tag.
 * @param {Object} attrObj The attributes as a JSON object.
 * @returns {undefined}
 */
const handleAttributeObject = (htmlTag, attrObj) => {
  const keys = Object.keys(attrObj)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const newValue = attrObj[key] instanceof Array ? attrObj[key].join(' ') :
                     attrObj[key]

    if (htmlTag.hasAttribute(key)) {
      const currentValue = htmlTag.getAttribute(key)
      htmlTag.setAttribute(key, currentValue + ' ' + newValue)
    } else {
      htmlTag.setAttribute(key, newValue)
    }
  }
}

/**
 * Creates an HTML attribute.
 * @param {string} key The attribute name.
 * @param {any} value The attribute value.
 * @returns {Attr} The attribute node.
 */
export const attr = (key, value) => {
  const node = document.createAttribute(key)
  node.value = value
  return node
}

/**
 * @callback EventCallback
 * @param {Event} [event] The triggering event, if any.
 * @returns {undefined}
 */

/**
 * An event container.  Serves only to represent a type/callback pair for a
 * potential future `HTMLElement.addEventListener()`.
 */
export class EventListener {
  /**
   * @param {string} type The event type.
   * @param {EventCallback} callback The callback function.
   */
  constructor(type, callback) {
    this.type = type
    this.callback = callback
  }
}

/**
 * Creates a number of event containers for a callback function.
 * @param {string} types The event types separated by spaces.
 * @param {EventCallback} callback The callback function.
 * @returns {EventListener[]} The event containers.
 */
export const on = (types, callback) => {
  return types.split(' ').map((type) => new EventListener(type, callback))
}

/**
 * A shadow root container.  Serves only to represent the components that make
 * up a potential future `HTMLElement.attachShadow()`.
 */
export class Shadow {
  /**
   * @param {(HTMLElement | Text)[]} children The children of the shadow root.
   * @param {CSSStyleSheet[]} sheets The CSS stylesheets adopted by this shadow
   * root.
   */
  constructor(children, sheets) {
    this.children = children
    this.sheets = sheets
  }
}

/**
 * Creates a shadow root that can be attached to an element.
 * @param {...CSSStyleSheet | HTMLElement | Text | Array | string} children
 * The children that the shadow root contains.
 * @returns {Shadow} The created shadow root.
 */
export const shadow = (...children) => {
  let components = []
  let sheets = []

  const process = (unprocessedChildren) => {
    for (let i = 0; i < unprocessedChildren.length; i++) {
      const child = unprocessedChildren[i]
      if (child instanceof CSSStyleSheet) {
        sheets.push(child)
      } else if (child instanceof HTMLElement || child instanceof Text) {
        components.push(child)
      } else if (child instanceof Array) {
        process(child)
      } else if (child !== null && child !== undefined) {
        components.push(document.createTextNode(child))
      }
    }
  }

  process(children)
  return new Shadow(components, sheets)
}

/**
 * Creates a shortcut tag function.
 * @param {string} name The name of the tag.
 * @param {...any} x Arguments that should be applied to every tag created
 * with this shortcut.
 * @returns {function(...any): HTMLElement} The shortcut function.
 */
export const shortTag = (name, ...x) => (...y) => tag(name, ...x, ...y)

export const h1 = shortTag('h1')
export const h2 = shortTag('h2')
export const h3 = shortTag('h3')
export const h4 = shortTag('h4')
export const h5 = shortTag('h6')
export const h6 = shortTag('h6')
export const a = shortTag('a')
export const b = shortTag('b')
export const br = shortTag('br')
export const button = shortTag('button')
export const code = shortTag('code')
export const dd = shortTag('dd')
export const div = shortTag('div')
export const dl = shortTag('dl')
export const dt = shortTag('dt')
export const em = shortTag('em')
export const form = shortTag('form')
export const hr = shortTag('hr')
export const i = shortTag('i')
export const img = shortTag('img')
export const li = shortTag('li')
export const ol = shortTag('ol')
export const p = shortTag('p')
export const pre = shortTag('pre')
export const q = shortTag('q')
export const s = shortTag('s')
export const section = shortTag('section')
export const span = shortTag('span')
export const strong = shortTag('strong')
export const sub = shortTag('sub')
export const sup = shortTag('sup')
export const table = shortTag('table')
export const td = shortTag('td')
export const textarea = shortTag('textarea')
export const th = shortTag('th')
export const tr = shortTag('tr')
export const u = shortTag('u')
export const ul = shortTag('ul')
export const main = shortTag('main')
export const footer = shortTag('footer')
export const header = shortTag('header')
export const details = shortTag('details')
export const slot = shortTag('slot')
