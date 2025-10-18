export type AttrObject = {
    [key: string]: string | Array<string>;
};
export type TagChild = string | HTMLElement | Text | Attr | EventListener | Shadow | AttrObject | Array<TagChild>;
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
export declare const tag: (name: string, ...children: TagChild[]) => HTMLElement;
/**
 * Creates an HTML attribute.
 * @param key The attribute name.
 * @param value The attribute value.
 * @returns The attribute node.
 */
export declare const attr: (key: string, value: string) => Attr;
/**
 * An event container.  Serves only to represent a type/callback pair for a
 * potential future `HTMLElement.addEventListener()`.
 */
export declare class EventListener {
    type: string;
    callback: EventListenerOrEventListenerObject;
    options: EventListenerOptions | undefined;
    /**
     * @param type The event type.
     * @param callback The callback function.
     * @param options The event listener options.
     */
    constructor(type: string, callback: EventListenerOrEventListenerObject, options: EventListenerOptions | undefined);
}
/**
 * Creates a number of event containers for a callback function.
 * @param types The event types separated by spaces.
 * @param callback The callback function.
 * @param options The event listener options.
 * @returns The event containers.
 */
export declare const on: (types: string, callback: EventListenerOrEventListenerObject, options: EventListenerOptions | undefined) => EventListener[];
/**
 * A shadow root container.  Serves only to represent the components that make
 * up a potential future `HTMLElement.attachShadow()`.
 */
export declare class Shadow {
    children: (HTMLElement | Text)[];
    sheets: CSSStyleSheet[];
    /**
     * @param children The children of the shadow root.
     * @param sheets The CSS stylesheets adopted by this shadow root.
     */
    constructor(children: (HTMLElement | Text)[], sheets: CSSStyleSheet[]);
}
export type ShadowChild = CSSStyleSheet | string | HTMLElement | Text | Array<ShadowChild>;
/**
 * Creates a shadow root that can be attached to an element.
 * @param children
 * The children that the shadow root contains.
 * @returns The created shadow root.
 */
export declare const shadow: (...children: ShadowChild[]) => Shadow;
/**
 * Creates a shortcut tag function.
 * @param name The name of the tag.
 * @param x Arguments that should be applied to every tag created
 * with this shortcut.
 * @returns The shortcut function.
 */
export declare const shortTag: (name: string, ...x: TagChild[]) => (...y: TagChild[]) => HTMLElement;
export declare const h1: (...y: TagChild[]) => HTMLElement;
export declare const h2: (...y: TagChild[]) => HTMLElement;
export declare const h3: (...y: TagChild[]) => HTMLElement;
export declare const h4: (...y: TagChild[]) => HTMLElement;
export declare const h5: (...y: TagChild[]) => HTMLElement;
export declare const h6: (...y: TagChild[]) => HTMLElement;
export declare const a: (...y: TagChild[]) => HTMLElement;
export declare const b: (...y: TagChild[]) => HTMLElement;
export declare const br: (...y: TagChild[]) => HTMLElement;
export declare const button: (...y: TagChild[]) => HTMLElement;
export declare const code: (...y: TagChild[]) => HTMLElement;
export declare const dd: (...y: TagChild[]) => HTMLElement;
export declare const div: (...y: TagChild[]) => HTMLElement;
export declare const dl: (...y: TagChild[]) => HTMLElement;
export declare const dt: (...y: TagChild[]) => HTMLElement;
export declare const em: (...y: TagChild[]) => HTMLElement;
export declare const form: (...y: TagChild[]) => HTMLElement;
export declare const hr: (...y: TagChild[]) => HTMLElement;
export declare const i: (...y: TagChild[]) => HTMLElement;
export declare const img: (...y: TagChild[]) => HTMLElement;
export declare const li: (...y: TagChild[]) => HTMLElement;
export declare const ol: (...y: TagChild[]) => HTMLElement;
export declare const p: (...y: TagChild[]) => HTMLElement;
export declare const pre: (...y: TagChild[]) => HTMLElement;
export declare const q: (...y: TagChild[]) => HTMLElement;
export declare const s: (...y: TagChild[]) => HTMLElement;
export declare const section: (...y: TagChild[]) => HTMLElement;
export declare const span: (...y: TagChild[]) => HTMLElement;
export declare const strong: (...y: TagChild[]) => HTMLElement;
export declare const sub: (...y: TagChild[]) => HTMLElement;
export declare const sup: (...y: TagChild[]) => HTMLElement;
export declare const table: (...y: TagChild[]) => HTMLElement;
export declare const td: (...y: TagChild[]) => HTMLElement;
export declare const textarea: (...y: TagChild[]) => HTMLElement;
export declare const th: (...y: TagChild[]) => HTMLElement;
export declare const tr: (...y: TagChild[]) => HTMLElement;
export declare const u: (...y: TagChild[]) => HTMLElement;
export declare const ul: (...y: TagChild[]) => HTMLElement;
export declare const main: (...y: TagChild[]) => HTMLElement;
export declare const footer: (...y: TagChild[]) => HTMLElement;
export declare const header: (...y: TagChild[]) => HTMLElement;
export declare const details: (...y: TagChild[]) => HTMLElement;
export declare const slot: (...y: TagChild[]) => HTMLElement;
