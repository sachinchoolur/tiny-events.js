/**
 * TinyEvents is a tiny event utility library for modern browsers(IE 11+).
 * Supports jQuery like syntax. just 1 kb gzipped.
 * Author - Sachin Neravath
 */
export declare type Selector = EventTarget | NodeList | string | null;
export declare type TinyEventsElements = EventTarget | NodeList | null;
export declare type TinyEventsElement = EventTarget | Node | null;
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
export declare class TinyEvents {
    elements: TinyEventsElements;
    element: TinyEventsElement;
    static eventListeners: {
        [x: string]: EventListener[];
    };
    constructor(selector: Selector);
    static getIdFromSelector(selector: string): string | undefined;
    static getSelector(selector: Selector): TinyEventsElements;
    static isNodeList(elements: TinyEventsElements): boolean;
    getFirstEl(): Node;
    each(func: (el: TinyEventsElement, index: number) => void): this;
    on(eventNames: string, selector: EventListener | string, listener?: EventListener): this;
    static foundTarget(target: EventTarget | null, selector: string): boolean;
    static createNewEvent(eventName: string): Event;
    static generateUUID(): string;
    static setEventName(el: TinyEventsNode, eventName: string): string;
    static getElementEventName(el: TinyEventsNode, eventName: string): string;
    static getEventName(eventName: string, uuid: string): string;
    static getEventNameFromId(eventName: string): string;
    one(eventNames: string, selector: EventListener | string, listener?: EventListener): this;
    off(eventNames: string): this;
    trigger(event: string, detail?: unknown): this;
    static contains(selector: string, child: Node): boolean;
    static is(el: MatchesElement, otherEl: string): boolean;
    static isEventMatched(event: string, eventName: string): boolean;
}
export {};
