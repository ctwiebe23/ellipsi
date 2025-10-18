export type AttrObj = { [key: string]: string }

export type TagChild =
    | string
    | HTMLElement
    | Text
    | Attr
    | EventListener
    | Shadow
    | AttrObj
    | Array<TagChild>

/**
 * Creates an HTML tag.  Many helper functions are provided as shortcuts for
 * creating commmon elements.
 * @param name The tag name.
 * @param children
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
 * @returns The created HTML tag.
 */
export const tag: (name: string, ...children: TagChild[]) => HTMLElement

/**
 * Adds an attribute node to a tag safely.
 * @param htmlTag The HTML tag.
 * @param attrNode The HTML attribute.
 */
const handleAttributeNode: (
    htmlTag: HTMLElement,
    attrNode: Attr,
) => undefined

/**
 * Adds attributes to a tag from a JSON object.
 * @param htmlTag The HTML tag.
 * @param attrObj The attributes as a JSON object.
 */
const handleAttributeObject: (
    htmlTag: HTMLElement,
    attrObj: AttrObj,
) => undefined

/**
 * Creates an HTML attribute.
 * @param key The attribute name.
 * @param value The attribute value.
 * @returns The attribute node.
 */
export const attr: (key: string, value: string) => Attr

export type EventCallback = (event: Event | undefined) => undefined

/**
 * An event container.  Serves only to represent a type/callback pair for a
 * potential future `HTMLElement.addEventListener()`.
 */
export class EventListener {
    type: string
    callback: EventCallback
    options: EventListenerOptions | undefined
}

/**
 * Creates a number of event containers for a callback function.
 * @param {string} types The event types separated by spaces.
 * @param {EventCallback} callback The callback function.
 * @param {EventListenerOptions} [options] The event listener options.
 * @returns {EventListener[]} The event containers.
 */
export const on: (
    types: string,
    callback: EventCallback,
    options: EventListenerOptions | undefined,
) => EventListener[]

/**
 * A shadow root container.  Serves only to represent the components that make
 * up a potential future `HTMLElement.attachShadow()`.
 */
export class Shadow {
    children: (HTMLElement | Text)[]
    sheets: CSSStyleSheet[]
}

export type ShadowChildren =
    | CSSStyleSheet
    | HTMLElement
    | Text
    | Array<ShadowChildren>
    | string

/**
 * Creates a shadow root that can be attached to an element.
 * @param children The children that the shadow root contains.
 * @returns The created shadow root.
 */
export const shadow: (...children: ShadowChildren[]) => Shadow

/**
 * Creates a shortcut tag function.
 * @param name The name of the tag.
 * @param x Arguments that should be applied to every tag created
 * with this shortcut.
 * @returns The shortcut function.
 */
export const shortTag: (
    name: string,
    ...x: TagChild[]
) => (...y: TagChild[]) => HTMLElement

export const h1: (...children: TagChild[]) => HTMLElement
export const h2: (...children: TagChild[]) => HTMLElement
export const h3: (...children: TagChild[]) => HTMLElement
export const h4: (...children: TagChild[]) => HTMLElement
export const h5: (...children: TagChild[]) => HTMLElement
export const h6: (...children: TagChild[]) => HTMLElement
export const a: (...children: TagChild[]) => HTMLElement
export const b: (...children: TagChild[]) => HTMLElement
export const br: (...children: TagChild[]) => HTMLElement
export const button: (...children: TagChild[]) => HTMLElement
export const code: (...children: TagChild[]) => HTMLElement
export const dd: (...children: TagChild[]) => HTMLElement
export const div: (...children: TagChild[]) => HTMLElement
export const dl: (...children: TagChild[]) => HTMLElement
export const dt: (...children: TagChild[]) => HTMLElement
export const em: (...children: TagChild[]) => HTMLElement
export const form: (...children: TagChild[]) => HTMLElement
export const hr: (...children: TagChild[]) => HTMLElement
export const i: (...children: TagChild[]) => HTMLElement
export const img: (...children: TagChild[]) => HTMLElement
export const li: (...children: TagChild[]) => HTMLElement
export const ol: (...children: TagChild[]) => HTMLElement
export const p: (...children: TagChild[]) => HTMLElement
export const pre: (...children: TagChild[]) => HTMLElement
export const q: (...children: TagChild[]) => HTMLElement
export const s: (...children: TagChild[]) => HTMLElement
export const section: (...children: TagChild[]) => HTMLElement
export const span: (...children: TagChild[]) => HTMLElement
export const strong: (...children: TagChild[]) => HTMLElement
export const sub: (...children: TagChild[]) => HTMLElement
export const sup: (...children: TagChild[]) => HTMLElement
export const table: (...children: TagChild[]) => HTMLElement
export const td: (...children: TagChild[]) => HTMLElement
export const textarea: (...children: TagChild[]) => HTMLElement
export const th: (...children: TagChild[]) => HTMLElement
export const tr: (...children: TagChild[]) => HTMLElement
export const u: (...children: TagChild[]) => HTMLElement
export const ul: (...children: TagChild[]) => HTMLElement
export const main: (...children: TagChild[]) => HTMLElement
export const footer: (...children: TagChild[]) => HTMLElement
export const header: (...children: TagChild[]) => HTMLElement
export const details: (...children: TagChild[]) => HTMLElement
export const slot: (...children: TagChild[]) => HTMLElement
