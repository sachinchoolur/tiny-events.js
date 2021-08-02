/**
 * TinyEvents is a tiny, framework-agnostic, event utility library for modern browsers(IE 11+).
 * Supports jQuery like syntax. just 1 kb gzipped.
 * Author - Sachin Neravath
 */

export type Selector = EventTarget | NodeList | string | null;
export type TinyEventsElements = EventTarget | NodeList | null;
export type TinyEventsElement = EventTarget | Node | null;
interface EventListener {
    (evt: Event): void;
}
interface MatchesElement extends Element {
    matchesSelector(selectors: string): boolean;
    msMatchesSelector(selectors: string): boolean;
    mozMatchesSelector(selectors: string): boolean;
    webkitMatchesSelector(selectors: string): boolean;
    oMatchesSelector(selectors: string): boolean;
}

export interface TinyEventsNode extends Node {
    eventEmitterUUID: string;
}
// Custom event polyfill for old browsers
// eslint-disable-next-line func-names
(function () {
    /* istanbul ignore next */
    if (typeof window.CustomEvent === 'function') return false;

    /* istanbul ignore next */
    function CustomEvent(
        event: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: { bubbles: boolean; cancelable: boolean; detail: any },
    ) {
        /* istanbul ignore next */
        // eslint-disable-next-line no-param-reassign
        params = params || { bubbles: false, cancelable: false, detail: null };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail,
        );
        return evt;
    }

    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).CustomEvent = CustomEvent;
})();
// eslint-disable-next-line import/prefer-default-export
export class TinyEvents {
    elements: TinyEventsElements;

    element: TinyEventsElement;

    static eventListeners: { [x: string]: EventListener[] };

    constructor(selector: Selector) {
        this.elements = TinyEvents.getSelector(selector);
        this.element = this.getFirstEl();
        return this;
    }

    static getIdFromSelector(selector: string): string | undefined {
        if (selector.indexOf(',') > -1) {
            return;
        }
        const selectors = selector.split(' ');
        const lastSelector = selectors[selectors.length - 1];
        const fl = lastSelector.substring(0, 1);
        if (fl === '#') {
            return lastSelector.substring(1);
        }
    }

    static getSelector(selector: Selector): TinyEventsElements {
        if (typeof selector !== 'string') {
            return selector;
        }

        // For performance reasons, use getElementById
        const id = TinyEvents.getIdFromSelector(selector);
        if (id) {
            return document.getElementById(id);
        }
        return document.querySelectorAll(selector);
    }

    static isNodeList(elements: TinyEventsElements): boolean {
        if (!elements) {
            return false;
        }
        return Object.prototype.isPrototypeOf.call(
            NodeList.prototype,
            elements,
        );
    }

    getFirstEl(): Node {
        if (TinyEvents.isNodeList(this.elements)) {
            return (this.elements as NodeList)[0];
        }
        return this.elements as Node;
    }

    each(func: (el: TinyEventsElement, index: number) => void): this {
        if (!this.elements) {
            return this;
        }
        if (TinyEvents.isNodeList(this.elements)) {
            [].slice
                .call(this.elements as ArrayLike<Node>)
                .forEach((el, index) => {
                    func.call(el, el, index);
                });
        } else {
            func.call(this.element, this.element, 0);
        }
        return this;
    }

    on(
        eventNames: string,
        selector: EventListener | string,
        listener?: EventListener,
    ): this {
        // Manage multiple events
        eventNames.split(' ').forEach((eventName) => {
            this.each((el) => {
                const tNEventName = TinyEvents.setEventName(
                    el as TinyEventsNode,
                    eventName,
                );

                let listenerFn = listener;
                if (typeof selector === 'string') {
                    listenerFn = (evt: Event) => {
                        if (TinyEvents.foundTarget(evt.target, selector)) {
                            if (typeof listener === 'function') {
                                listener(evt);
                            }
                        }
                    };
                } else {
                    listenerFn = selector;
                }

                if (typeof listenerFn === 'function') {
                    if (
                        !Array.isArray(TinyEvents.eventListeners[tNEventName])
                    ) {
                        TinyEvents.eventListeners[tNEventName] = [];
                    }
                    TinyEvents.eventListeners[tNEventName].push(listenerFn);

                    // https://github.com/microsoft/TypeScript/issues/28357
                    el?.addEventListener(
                        eventName.split('.')[0],
                        listenerFn as EventListener,
                    );
                }
            });
        });

        return this;
    }

    static foundTarget(target: EventTarget | null, selector: string): boolean {
        return (
            TinyEvents.is(target as MatchesElement, selector) ||
            TinyEvents.contains(selector, target as Node)
        );
    }

    static createNewEvent(eventName: string): Event {
        let event;
        /* istanbul ignore next */
        if (typeof Event === 'function') {
            event = new Event(eventName);
        } else {
            /* istanbul ignore next */
            event = document.createEvent('Event');
            /* istanbul ignore next */
            event.initEvent(eventName, true, true);
        }
        return event;
    }

    static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    static setEventName(el: TinyEventsNode, eventName: string): string {
        // Need to verify https://stackoverflow.com/questions/1915341/whats-wrong-with-adding-properties-to-dom-element-objects
        const elementUUId = el.eventEmitterUUID;
        const uuid = elementUUId || TinyEvents.generateUUID();
        // eslint-disable-next-line no-param-reassign
        el.eventEmitterUUID = uuid;
        return TinyEvents.getEventName(eventName, uuid);
    }

    static getElementEventName(el: TinyEventsNode, eventName: string): string {
        const elementUUId = el.eventEmitterUUID;
        /* istanbul ignore next */
        const uuid = elementUUId || TinyEvents.generateUUID();
        // eslint-disable-next-line no-param-reassign
        el.eventEmitterUUID = uuid;
        return TinyEvents.getEventName(eventName, uuid);
    }

    static getEventName(eventName: string, uuid: string): string {
        return `${eventName}__EVENT_EMITTER__${uuid}`;
    }

    static getEventNameFromId(eventName: string): string {
        return eventName.split('__EVENT_EMITTER__')[0];
    }

    one(
        eventNames: string,
        selector: EventListener | string,
        listener?: EventListener,
    ): this {
        eventNames.split(' ').forEach((eventName) => {
            this.each((el) => {
                const listnerFn = (evt: Event) => {
                    new TinyEvents(el).off(eventName);
                    if (typeof selector === 'string') {
                        if (listener) {
                            listener(evt);
                        }
                    } else {
                        selector(evt);
                    }
                };

                if (typeof selector === 'string') {
                    new TinyEvents(el).on(eventName, selector, listnerFn);
                } else {
                    new TinyEvents(el).on(eventName, listnerFn);
                }
            });
        });
        return this;
    }

    off(eventNames: string): this {
        Object.keys(TinyEvents.eventListeners).forEach((tNEventName) => {
            const currentEventName = TinyEvents.getEventNameFromId(tNEventName);
            eventNames.split(' ').forEach((eventName) => {
                if (TinyEvents.isEventMatched(eventName, currentEventName)) {
                    this.each((el) => {
                        if (
                            TinyEvents.getElementEventName(
                                el as TinyEventsNode,
                                currentEventName,
                            ) === tNEventName
                        ) {
                            TinyEvents.eventListeners[tNEventName].forEach(
                                (listener) => {
                                    (el as HTMLElement).removeEventListener(
                                        currentEventName.split('.')[0],
                                        listener,
                                    );
                                },
                            );
                            delete TinyEvents.eventListeners[tNEventName];
                        }
                    });
                }
            });
        });
        return this;
    }

    trigger(event: string, detail?: unknown): this {
        if (!this.element) {
            return this;
        }
        const eventName = event.split('.')[0];
        const isNativeEvent =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof (document.body as any)[`on${eventName}`] !== 'undefined';
        if (isNativeEvent) {
            this.each((el) => {
                el?.dispatchEvent(TinyEvents.createNewEvent(eventName));
            });
            return this;
        }
        const customEvent = new CustomEvent(eventName, {
            detail: detail || null,
        });
        this.each((el) => {
            el?.dispatchEvent(customEvent);
        });
        return this;
    }

    static contains(selector: string, child: Node): boolean {
        let found = false;
        // eslint-disable-next-line no-use-before-define
        new TinyEvents(selector).each((el) => {
            if (el !== child && (el as Node).contains(child)) {
                found = true;
            }
        });
        return found;
    }

    static is(el: MatchesElement, otherEl: string): boolean {
        /* istanbul ignore next */
        return (
            el.matches ||
            el.matchesSelector ||
            el.msMatchesSelector ||
            el.mozMatchesSelector ||
            el.webkitMatchesSelector ||
            el.oMatchesSelector
        ).call(el, otherEl);
    }

    static isEventMatched(event: string, eventName: string): boolean {
        const eventNamespace = eventName.split('.');
        return event
            .split('.')
            .filter((e) => e)
            .every((e) => eventNamespace.indexOf(e) !== -1);
    }
}

TinyEvents.eventListeners = {};
