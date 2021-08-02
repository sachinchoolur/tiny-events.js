import { Selector, TinyEvents } from './tiny-events';

function tinyEvents(selector: Selector): TinyEvents {
    return new TinyEvents(selector);
}
export default tinyEvents;
