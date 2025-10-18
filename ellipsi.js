var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
export var tag = function (name) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    var htmlTag = document.createElement(name);
    var process = function (unprocessedChildren) {
        for (var i_1 = 0; i_1 < unprocessedChildren.length; i_1++) {
            var child = unprocessedChildren[i_1];
            if (child instanceof HTMLElement || child instanceof Text) {
                htmlTag.appendChild(child);
            }
            else if (child instanceof Attr) {
                handleAttributeNode(htmlTag, child);
            }
            else if (child instanceof EventListener) {
                htmlTag.addEventListener(child.type, child.callback, child.options);
            }
            else if (child instanceof Shadow) {
                var shadowRoot = htmlTag.attachShadow({ mode: 'open' });
                shadowRoot.adoptedStyleSheets = child.sheets;
                for (var k = 0; k < child.children.length; k++) {
                    var childChild = child.children[k];
                    shadowRoot.appendChild(childChild);
                }
            }
            else if (child instanceof Array) {
                process(child);
            }
            else if ((child === null || child === void 0 ? void 0 : child.constructor) === Object) {
                handleAttributeObject(htmlTag, child);
            }
            else if (child !== null && child !== undefined) {
                htmlTag.appendChild(document.createTextNode(child));
            }
        }
    };
    process(children);
    return htmlTag;
};
/**
 * Adds an attribute node to a tag safely.
 * @param htmlTag The HTML tag.
 * @param attrNode The HTML attribute.
 */
var handleAttributeNode = function (htmlTag, attrNode) {
    if (htmlTag.hasAttribute(attrNode.name)) {
        var currentValue = htmlTag.getAttribute(attrNode.name);
        htmlTag.setAttribute(attrNode.name, currentValue + ' ' + attrNode.value);
    }
    else {
        htmlTag.setAttributeNode(attrNode.cloneNode());
    }
};
/**
 * Adds attributes to a tag from a JSON object.
 * @param htmlTag The HTML tag.
 * @param attrObj The attributes as a JSON object.
 */
var handleAttributeObject = function (htmlTag, attrObj) {
    var keys = Object.keys(attrObj);
    for (var i_2 = 0; i_2 < keys.length; i_2++) {
        var key = keys[i_2];
        var newValue = attrObj[key] instanceof Array
            ? attrObj[key].join(' ')
            : attrObj[key];
        if (htmlTag.hasAttribute(key)) {
            var currentValue = htmlTag.getAttribute(key);
            htmlTag.setAttribute(key, currentValue + ' ' + newValue);
        }
        else {
            htmlTag.setAttribute(key, newValue);
        }
    }
};
/**
 * Creates an HTML attribute.
 * @param key The attribute name.
 * @param value The attribute value.
 * @returns The attribute node.
 */
export var attr = function (key, value) {
    var node = document.createAttribute(key);
    node.value = value;
    return node;
};
/**
 * An event container.  Serves only to represent a type/callback pair for a
 * potential future `HTMLElement.addEventListener()`.
 */
var EventListener = /** @class */ (function () {
    /**
     * @param type The event type.
     * @param callback The callback function.
     * @param options The event listener options.
     */
    function EventListener(type, callback, options) {
        this.type = type;
        this.callback = callback;
        this.options = options;
    }
    return EventListener;
}());
export { EventListener };
/**
 * Creates a number of event containers for a callback function.
 * @param types The event types separated by spaces.
 * @param callback The callback function.
 * @param options The event listener options.
 * @returns The event containers.
 */
export var on = function (types, callback, options) {
    return types
        .split(' ')
        .map(function (type) { return new EventListener(type, callback, options); });
};
/**
 * A shadow root container.  Serves only to represent the components that make
 * up a potential future `HTMLElement.attachShadow()`.
 */
var Shadow = /** @class */ (function () {
    /**
     * @param children The children of the shadow root.
     * @param sheets The CSS stylesheets adopted by this shadow root.
     */
    function Shadow(children, sheets) {
        this.children = children;
        this.sheets = sheets;
    }
    return Shadow;
}());
export { Shadow };
/**
 * Creates a shadow root that can be attached to an element.
 * @param children
 * The children that the shadow root contains.
 * @returns The created shadow root.
 */
export var shadow = function () {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    var components = [];
    var sheets = [];
    var process = function (unprocessedChildren) {
        for (var i_3 = 0; i_3 < unprocessedChildren.length; i_3++) {
            var child = unprocessedChildren[i_3];
            if (child instanceof CSSStyleSheet) {
                sheets.push(child);
            }
            else if (child instanceof HTMLElement || child instanceof Text) {
                components.push(child);
            }
            else if (child instanceof Array) {
                process(child);
            }
            else if (child !== null && child !== undefined) {
                components.push(document.createTextNode(child));
            }
        }
    };
    process(children);
    return new Shadow(components, sheets);
};
/**
 * Creates a shortcut tag function.
 * @param name The name of the tag.
 * @param x Arguments that should be applied to every tag created
 * with this shortcut.
 * @returns The shortcut function.
 */
export var shortTag = function (name) {
    var x = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i];
    }
    return function () {
        var y = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            y[_i] = arguments[_i];
        }
        return tag.apply(void 0, __spreadArray(__spreadArray([name], x, false), y, false));
    };
};
export var h1 = shortTag('h1');
export var h2 = shortTag('h2');
export var h3 = shortTag('h3');
export var h4 = shortTag('h4');
export var h5 = shortTag('h6');
export var h6 = shortTag('h6');
export var a = shortTag('a');
export var b = shortTag('b');
export var br = shortTag('br');
export var button = shortTag('button');
export var code = shortTag('code');
export var dd = shortTag('dd');
export var div = shortTag('div');
export var dl = shortTag('dl');
export var dt = shortTag('dt');
export var em = shortTag('em');
export var form = shortTag('form');
export var hr = shortTag('hr');
export var i = shortTag('i');
export var img = shortTag('img');
export var li = shortTag('li');
export var ol = shortTag('ol');
export var p = shortTag('p');
export var pre = shortTag('pre');
export var q = shortTag('q');
export var s = shortTag('s');
export var section = shortTag('section');
export var span = shortTag('span');
export var strong = shortTag('strong');
export var sub = shortTag('sub');
export var sup = shortTag('sup');
export var table = shortTag('table');
export var td = shortTag('td');
export var textarea = shortTag('textarea');
export var th = shortTag('th');
export var tr = shortTag('tr');
export var u = shortTag('u');
export var ul = shortTag('ul');
export var main = shortTag('main');
export var footer = shortTag('footer');
export var header = shortTag('header');
export var details = shortTag('details');
export var slot = shortTag('slot');
