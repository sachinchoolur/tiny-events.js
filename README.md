#### Test coverage

| Statements                                                                      | Functions                                                                   | Lines                                                               |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg) |



# TinyEvents

TinyEvents is a tiny, framework-agnostic, event utility library for modern browsers(IE 11+). Supports jQuery like syntax. Just 1 kb gzipped.

- Event namespace support
- Works with collection of elements
- Custom events support
- Add or remove multiple events at a time.
- Easy event delegation
- Attach event listeners to dynamically added element
- And more. Just 1 kb

#### Codepen Demo - https://codepen.io/sachinchoolur/pen/zYwaMqy


# Installation

TinyEvents is available on NPM, Yarn, and GitHub. You can use any of the following method to download tinyEvents

-   [NPM](https://www.npmjs.com/) - NPM is a package manager for the JavaScript
    programming language. You can install `tiny-events.js` using the following
    command

    ```sh
    npm install tiny-events.js
    ```

-   [YARN](https://yarnpkg.com/) - Yarn is another popular package manager for
    the JavaScript programming language. If you prefer you can use Yarn instead
    of NPM

    ```sh
    yarn add tiny-events.js
    ```

-   [GitHub](https://github.com/sachinchoolur/tinyevents/archive/master.zip) -
    You can also directly download tinyevents from GitHub


# Usage example

```html
<button class="change-bg">Change background color</button>
<button class="change-color">Change color</button>
<button class="remove-btn">Remove click</button>
<span id="color-code">#FFF</span>
```
```js

import tinyEvents from 'tinyevents';

tinyEvents(".change-bg").on("click.sample mouseover.sample", () => {
  const color = getRandomColor();
  document.body.style.backgroundColor = color;
  triggerColorChange(color);
});

tinyEvents(".change-color").on("click.sample", () => {
  const color = getRandomColor();
  document.body.style.color = color;
  triggerColorChange(color);
});

tinyEvents(".remove-btn").on("click", () => {
  tinyEvents(".change-bg, .change-color").off(".sample");
});

tinyEvents("#color-code").on("color-change", (event) => {
  const { color } = event.detail;
  document.getElementById("color-code").innerHTML = color;
});

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function triggerColorChange(color) {
  // Custom events demo
  tinyEvents("#color-code").trigger("color-change", {
    color
  });
}

```

### API
- on - Attach an event handler function for one or more events to the selected elements.
- off - Remove an event handlers.
- one - Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
- trigger - Execute all handlers and behaviors attached to the matched elements for the given event type.


### On
Attach an event handler function for one or more events to the selected elements.

```js

import $ from 'tinyevents';

$('.btn').on('click.bg mouseover.bg', () => {
    document.body.style.backgroundColor = 'red';
});

$('.btn').on('my-custom-event', (e) => {
    console.log(e.detail)
});
```
##### Delegation

> Event delegation is an event handling technique where, instead of attaching event handlers directly to every element you want to listen to events on, you attach a single event handler to a parent element of those elements to listen for events occurring on it’s descendant elements

By passing a selector as the second argument to `on()` method, the event handler will fire only if the event is triggered on the selector

```js

import tinyEvents from 'tinyevents';

tinyEvents('body').on('mousemove', 'span', () => {
    console.log('Hovering over span');
});


```

### Off
Remove event handlers.

```js

$('.btn').on('click.bg hover.bg', () => {
    document.body.style.backgroundColor = 'red';
});

// Removes both click and hover event handlers
tinyEvents('.btn').off('click.bg hover.bg');

// Removes event handlers by namespace
// Removes both click and hover event handlers
tinyEvents('.btn').off('.bg');

// Removes all click events handlers that were attached with .on()
tinyEvents('.btn').off('click');

// Another example with multiple namespaces
$('.btn').on('click.abc', () => {
    document.body.style.color = 'red';
});
$('.btn').on('click.xyz', () => {
    document.body.style.backgroundColor = 'yellow';
});

// Removes both event handlers
tinyEvents('.btn').off('.abc .xyz');

```

### One

Attach a handler to an event for the elements. The handler is executed at most once per element per event type.

```js
tinyEvents('.btn').one('click', () => {
    alert('This will be displayed only once.');
});

// or

tinyEvents('ul').one('click', 'li', () => {
    alert('This will be displayed only once.');
});
```


### Trigger
Execute all handlers and behaviors attached to the matched elements for the given event type.

```js
tinyEvents('.btn').trigger('click');

tinyEvents('.btn').on('my-custom-event', (event) => {
    // prints 'custom-event'
    console.log(event.detail.type)
});

tinyEvents('.btn').trigger('my-custom-event', {
  type: 'custom-event',
  purpose: 'some text'
});
```

## MIT License
