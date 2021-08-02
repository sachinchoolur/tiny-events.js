/**
 * tiny-events.js | 0.0.1 | August 2nd 2021
 *
 * Copyright (c) 2020 Sachin Neravath
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tinyEvents = factory());
}(this, (function () { 'use strict';

    /**
     * TinyEvents is a tiny, framework-agnostic, event utility library for modern browsers(IE 11+).
     * Supports jQuery like syntax. just 1 kb gzipped.
     * Author - Sachin Neravath
     */
    // Custom event polyfill for old browsers
    // eslint-disable-next-line func-names
    (function () {
        /* istanbul ignore next */
        if (typeof window.CustomEvent === 'function')
            return false;
        /* istanbul ignore next */
        function CustomEvent(event, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params) {
            /* istanbul ignore next */
            // eslint-disable-next-line no-param-reassign
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        /* istanbul ignore next */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.CustomEvent = CustomEvent;
    })();
    // eslint-disable-next-line import/prefer-default-export
    var TinyEvents = /** @class */ (function () {
        function TinyEvents(selector) {
            this.elements = TinyEvents.getSelector(selector);
            this.element = this.getFirstEl();
            return this;
        }
        TinyEvents.getIdFromSelector = function (selector) {
            if (selector.indexOf(',') > -1) {
                return;
            }
            var selectors = selector.split(' ');
            var lastSelector = selectors[selectors.length - 1];
            var fl = lastSelector.substring(0, 1);
            if (fl === '#') {
                return lastSelector.substring(1);
            }
        };
        TinyEvents.getSelector = function (selector) {
            if (typeof selector !== 'string') {
                return selector;
            }
            // For performance reasons, use getElementById
            var id = TinyEvents.getIdFromSelector(selector);
            if (id) {
                return document.getElementById(id);
            }
            return document.querySelectorAll(selector);
        };
        TinyEvents.isNodeList = function (elements) {
            if (!elements) {
                return false;
            }
            return Object.prototype.isPrototypeOf.call(NodeList.prototype, elements);
        };
        TinyEvents.prototype.getFirstEl = function () {
            if (TinyEvents.isNodeList(this.elements)) {
                return this.elements[0];
            }
            return this.elements;
        };
        TinyEvents.prototype.each = function (func) {
            if (!this.elements) {
                return this;
            }
            if (TinyEvents.isNodeList(this.elements)) {
                [].slice
                    .call(this.elements)
                    .forEach(function (el, index) {
                    func.call(el, el, index);
                });
            }
            else {
                func.call(this.element, this.element, 0);
            }
            return this;
        };
        TinyEvents.prototype.on = function (eventNames, selector, listener) {
            var _this = this;
            // Manage multiple events
            eventNames.split(' ').forEach(function (eventName) {
                _this.each(function (el) {
                    var tNEventName = TinyEvents.setEventName(el, eventName);
                    var listenerFn = listener;
                    if (typeof selector === 'string') {
                        listenerFn = function (evt) {
                            if (TinyEvents.foundTarget(evt.target, selector)) {
                                if (typeof listener === 'function') {
                                    listener(evt);
                                }
                            }
                        };
                    }
                    else {
                        listenerFn = selector;
                    }
                    if (typeof listenerFn === 'function') {
                        if (!Array.isArray(TinyEvents.eventListeners[tNEventName])) {
                            TinyEvents.eventListeners[tNEventName] = [];
                        }
                        TinyEvents.eventListeners[tNEventName].push(listenerFn);
                        // https://github.com/microsoft/TypeScript/issues/28357
                        el === null || el === void 0 ? void 0 : el.addEventListener(eventName.split('.')[0], listenerFn);
                    }
                });
            });
            return this;
        };
        TinyEvents.foundTarget = function (target, selector) {
            return (TinyEvents.is(target, selector) ||
                TinyEvents.contains(selector, target));
        };
        TinyEvents.createNewEvent = function (eventName) {
            var event;
            /* istanbul ignore next */
            if (typeof Event === 'function') {
                event = new Event(eventName);
            }
            else {
                /* istanbul ignore next */
                event = document.createEvent('Event');
                /* istanbul ignore next */
                event.initEvent(eventName, true, true);
            }
            return event;
        };
        TinyEvents.generateUUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0;
                var v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };
        TinyEvents.setEventName = function (el, eventName) {
            // Need to verify https://stackoverflow.com/questions/1915341/whats-wrong-with-adding-properties-to-dom-element-objects
            var elementUUId = el.eventEmitterUUID;
            var uuid = elementUUId || TinyEvents.generateUUID();
            // eslint-disable-next-line no-param-reassign
            el.eventEmitterUUID = uuid;
            return TinyEvents.getEventName(eventName, uuid);
        };
        TinyEvents.getElementEventName = function (el, eventName) {
            var elementUUId = el.eventEmitterUUID;
            /* istanbul ignore next */
            var uuid = elementUUId || TinyEvents.generateUUID();
            // eslint-disable-next-line no-param-reassign
            el.eventEmitterUUID = uuid;
            return TinyEvents.getEventName(eventName, uuid);
        };
        TinyEvents.getEventName = function (eventName, uuid) {
            return eventName + "__EVENT_EMITTER__" + uuid;
        };
        TinyEvents.getEventNameFromId = function (eventName) {
            return eventName.split('__EVENT_EMITTER__')[0];
        };
        TinyEvents.prototype.one = function (eventNames, selector, listener) {
            var _this = this;
            eventNames.split(' ').forEach(function (eventName) {
                _this.each(function (el) {
                    var listnerFn = function (evt) {
                        new TinyEvents(el).off(eventName);
                        if (typeof selector === 'string') {
                            if (listener) {
                                listener(evt);
                            }
                        }
                        else {
                            selector(evt);
                        }
                    };
                    if (typeof selector === 'string') {
                        new TinyEvents(el).on(eventName, selector, listnerFn);
                    }
                    else {
                        new TinyEvents(el).on(eventName, listnerFn);
                    }
                });
            });
            return this;
        };
        TinyEvents.prototype.off = function (eventNames) {
            var _this = this;
            Object.keys(TinyEvents.eventListeners).forEach(function (tNEventName) {
                var currentEventName = TinyEvents.getEventNameFromId(tNEventName);
                eventNames.split(' ').forEach(function (eventName) {
                    if (TinyEvents.isEventMatched(eventName, currentEventName)) {
                        _this.each(function (el) {
                            if (TinyEvents.getElementEventName(el, currentEventName) === tNEventName) {
                                TinyEvents.eventListeners[tNEventName].forEach(function (listener) {
                                    el.removeEventListener(currentEventName.split('.')[0], listener);
                                });
                                delete TinyEvents.eventListeners[tNEventName];
                            }
                        });
                    }
                });
            });
            return this;
        };
        TinyEvents.prototype.trigger = function (event, detail) {
            if (!this.element) {
                return this;
            }
            var eventName = event.split('.')[0];
            var isNativeEvent = 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof document.body["on" + eventName] !== 'undefined';
            if (isNativeEvent) {
                this.each(function (el) {
                    el === null || el === void 0 ? void 0 : el.dispatchEvent(TinyEvents.createNewEvent(eventName));
                });
                return this;
            }
            var customEvent = new CustomEvent(eventName, {
                detail: detail || null,
            });
            this.each(function (el) {
                el === null || el === void 0 ? void 0 : el.dispatchEvent(customEvent);
            });
            return this;
        };
        TinyEvents.contains = function (selector, child) {
            var found = false;
            // eslint-disable-next-line no-use-before-define
            new TinyEvents(selector).each(function (el) {
                if (el !== child && el.contains(child)) {
                    found = true;
                }
            });
            return found;
        };
        TinyEvents.is = function (el, otherEl) {
            /* istanbul ignore next */
            return (el.matches ||
                el.matchesSelector ||
                el.msMatchesSelector ||
                el.mozMatchesSelector ||
                el.webkitMatchesSelector ||
                el.oMatchesSelector).call(el, otherEl);
        };
        TinyEvents.isEventMatched = function (event, eventName) {
            var eventNamespace = eventName.split('.');
            return event
                .split('.')
                .filter(function (e) { return e; })
                .every(function (e) { return eventNamespace.indexOf(e) !== -1; });
        };
        return TinyEvents;
    }());
    TinyEvents.eventListeners = {};

    function tinyEvents(selector) {
        return new TinyEvents(selector);
    }

    return tinyEvents;

})));
//# sourceMappingURL=tiny-events.umd.js.map
