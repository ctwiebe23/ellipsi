export type AttrObject = { [key: string]: string | Array<string> }

export type TagChild =
    | string
    | HTMLElement
    | Text
    | Attr
    | EventListener
    | Shadow
    | AttrObject
    | Array<TagChild>

/**
 * Creates an HTML tag.  Many helper functions are provided as shortcuts for
 * creating commmon elements.
 * @param name The tag name.
 * @param children The children of the tag.  Handles different types
 * differently:
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
 * @returns The created HTML tag.
 */
export const tag = (name: string, ...children: TagChild[]): HTMLElement => {
    const htmlTag = document.createElement(name)

    const process = (unprocessedChildren) => {
        for (let i = 0; i < unprocessedChildren.length; i++) {
            const child = unprocessedChildren[i]
            if (child instanceof HTMLElement || child instanceof Text) {
                htmlTag.appendChild(child)
            } else if (child instanceof Attr) {
                handleAttributeNode(htmlTag, child)
            } else if (child instanceof EventListener) {
                htmlTag.addEventListener(
                    child.type,
                    child.callback,
                    child.options,
                )
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
 * @param htmlTag The HTML tag.
 * @param attrNode The HTML attribute.
 */
const handleAttributeNode = (htmlTag: HTMLElement, attrNode: Attr) => {
    if (htmlTag.hasAttribute(attrNode.name)) {
        const currentValue = htmlTag.getAttribute(attrNode.name)
        htmlTag.setAttribute(attrNode.name, currentValue + ' ' + attrNode.value)
    } else {
        htmlTag.setAttributeNode(attrNode.cloneNode() as Attr)
    }
}

/**
 * Adds attributes to a tag from a JSON object.
 * @param htmlTag The HTML tag.
 * @param attrObj The attributes as a JSON object.
 */
const handleAttributeObject = (htmlTag: HTMLElement, attrObj: AttrObject) => {
    const keys = Object.keys(attrObj)

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const newValue =
            attrObj[key] instanceof Array
                ? attrObj[key].join(' ')
                : attrObj[key]

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
 * @param key The attribute name.
 * @param value The attribute value.
 * @returns The attribute node.
 */
export const attr = (key: string, value: string): Attr => {
    const node = document.createAttribute(key)
    node.value = value
    return node
}

/**
 * An event container.  Serves only to represent a type/callback pair for a
 * potential future `HTMLElement.addEventListener()`.
 */
export class EventListener {
    type: string
    callback: EventListenerOrEventListenerObject
    options: EventListenerOptions | undefined

    /**
     * @param type The event type.
     * @param callback The callback function.
     * @param options The event listener options.
     */
    constructor(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options: EventListenerOptions | undefined,
    ) {
        this.type = type
        this.callback = callback
        this.options = options
    }
}

/**
 * Creates a number of event containers for a callback function.
 * @param types The event types separated by spaces.
 * @param callback The callback function.
 * @param options The event listener options.
 * @returns The event containers.
 */
export const on = (
    types: string,
    callback: EventListenerOrEventListenerObject,
    options: EventListenerOptions | undefined,
): EventListener[] => {
    return types
        .split(' ')
        .map((type) => new EventListener(type, callback, options))
}

/**
 * A shadow root container.  Serves only to represent the components that make
 * up a potential future `HTMLElement.attachShadow()`.
 */
export class Shadow {
    children: (HTMLElement | Text)[]
    sheets: CSSStyleSheet[]

    /**
     * @param children The children of the shadow root.
     * @param sheets The CSS stylesheets adopted by this shadow root.
     */
    constructor(children: (HTMLElement | Text)[], sheets: CSSStyleSheet[]) {
        this.children = children
        this.sheets = sheets
    }
}

export type ShadowChild =
    | CSSStyleSheet
    | string
    | HTMLElement
    | Text
    | Array<ShadowChild>

/**
 * Creates a shadow root that can be attached to an element.
 * @param children
 * The children that the shadow root contains.
 * @returns The created shadow root.
 */
export const shadow = (...children: ShadowChild[]): Shadow => {
    let components: (HTMLElement | Text)[] = []
    let sheets: CSSStyleSheet[] = []

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
 * @param name The name of the tag.
 * @param x Arguments that should be applied to every tag created
 * with this shortcut.
 * @returns The shortcut function.
 */
export const shortTag =
    (name: string, ...x: TagChild[]) =>
    (...y: TagChild[]) =>
        tag(name, ...x, ...y)

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
