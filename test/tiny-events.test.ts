import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import tinyEvents from '../src';
import { TinyEvents } from '../src/tiny-events';

describe('on, off, and trigger methods', () => {
    test('should be able to attach event listeners', () => {
        document.body.innerHTML = `<button class="btn"></button>
        <button id="btn-2">Button 2</button>`;

        let text = '';
        tinyEvents('#btn-2').on('click', () => {
            text = 'Button clicked';
        });
        userEvent.click(screen.getByText('Button 2'));

        expect(text).toBe('Button clicked');
    });
    test('on method should return this if element does not exist', () => {
        const $ = tinyEvents('#btn-does-not-exist').on('click', () => {});
        expect($).toBeInstanceOf(TinyEvents);
    });
    test('should be able to attach event listeners that works only once', () => {
        document.body.innerHTML = `<button class="btn">Button 2</button>
        <button class="btn">Button 3</button>`;

        let times = 0;

        tinyEvents('.btn').one('click', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 2'));
        userEvent.click(screen.getByText('Button 2'));
        userEvent.click(screen.getByText('Button 3'));

        expect(times).toBe(2);
    });
    test('should be able to attach event listeners on selected element that works only once', () => {
        let times = 0;
        document.body.innerHTML = `<div class="container" style="width:200px; height:200px"><button id="btn-1">Button 1</button>
        <button id="btn-2">Button 2</button></div>`;

        tinyEvents('.container').one('click.btn', '#btn-1', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 1'));
        userEvent.click(screen.getByText('Button 1'));
        expect(times).toEqual(1);

        userEvent.click(screen.getByText('Button 2'));
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toEqual(1);
    });
    test('should be able to attach event listeners on selected elements that works only once', () => {
        let times = 0;
        document.body.innerHTML = `<div class="container" style="width:200px; height:200px"><button class="btn">Button 1</button>
        <button class="btn">Button 2</button></div>
        <div class="container" style="width:200px; height:200px"><button class="btn">Button 3</button>
        <button class="btn">Button 4</button></div>`;

        tinyEvents('.container').one('click.btn', '.btn', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 1'));
        userEvent.click(screen.getByText('Button 1'));
        expect(times).toEqual(1);

        userEvent.click(screen.getByText('Button 3'));
        userEvent.click(screen.getByText('Button 3'));
        expect(times).toEqual(2);
    });

    test('should be able to attach event listeners to all matching elements ', () => {
        document.body.innerHTML = `<button class="btn">Button 1</button>
        <button class="btn">Button 2</button>`;

        let times = 0;

        tinyEvents('.btn').on('click', () => {
            times++;
        });

        userEvent.click(screen.getByText('Button 1'));
        expect(times).toBe(1);

        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(2);
    });
    test('should be able to remove event listeners from all matching elements ', () => {
        document.body.innerHTML = `<button class="btn">Button 1</button>
        <button class="btn">Button 2</button>`;

        let times = 0;

        tinyEvents('.btn').on('click', () => {
            times++;
        });

        userEvent.click(screen.getByText('Button 1'));
        expect(times).toBe(1);

        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(2);

        tinyEvents('.btn').off('click');

        userEvent.click(screen.getByText('Button 1'));
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(2);
    });
    test('off method should return this if element does not exist', () => {
        const $ = tinyEvents('#btn-does-not-exist').off('click');
        expect($).toBeInstanceOf(TinyEvents);
    });
    test('should be able to attach event listeners with namespace', () => {
        let times = 0;
        document.body.innerHTML = `<button class="btn"></button>
        <button id="btn-2">Button 2</button>`;

        tinyEvents('#btn-2').on('click.btn', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toEqual(1);

        userEvent.click(screen.getByText('Button 2'));
        expect(times).toEqual(2);
    });
    test('should trigger event only on the selected element', () => {
        let times = 0;
        document.body.innerHTML = `<div class="container" style="width:200px; height:200px"><button id="btn-1">Button 1</button>
        <button id="btn-2">Button 2</button></div>`;

        tinyEvents('.container').on('click.btn', '#btn-1', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 1'));
        expect(times).toEqual(1);

        userEvent.click(screen.getByText('Button 2'));
        expect(times).toEqual(1);
    });
    test('should trigger event only on the selected element or its children', () => {
        let times = 0;
        document.body.innerHTML = `<div class="container" style="width:200px; height:200px"><button id="btn-1"><span>Button 1</span></button>
        <button id="btn-2"><span>Button 2</span></button></div>`;

        tinyEvents('.container').on('click.btn', '#btn-1', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 1'));
        expect(times).toEqual(1);

        userEvent.click(screen.getByText('Button 2'));
        expect(times).toEqual(1);
    });
    test('should trigger event only on the selected elements', () => {
        let times = 0;
        document.body.innerHTML = `<div class="container" style="width:200px; height:200px"><button class="btn">Button 1</button>
        <button class="btn">Button 2</button></div>`;

        tinyEvents('.container').on('click.btn', '.btn', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 1'));
        expect(times).toEqual(1);

        userEvent.click(screen.getByText('Button 2'));
        expect(times).toEqual(2);
    });
    test('should be able to remove event listener', () => {
        let times = 0;
        document.body.innerHTML = `
        <button id="btn-2">Button 2</button>`;

        tinyEvents('#btn-2').on('click', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(1);

        tinyEvents('#btn-2').off('click');
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(1);
    });
    test('should be able to remove event listeners even if multiple listeners with same name attached', () => {
        let listener1 = 0;
        let listener2 = 0;
        document.body.innerHTML = `
        <button id="btn-2">Button 2</button>`;

        tinyEvents('#btn-2').on('click.abc', () => {
            listener1++;
        });
        tinyEvents('#btn-2').on('click.abc', () => {
            listener2++;
        });
        userEvent.click(screen.getByText('Button 2'));
        expect(listener1).toBe(1);
        expect(listener2).toBe(1);

        tinyEvents('#btn-2').off('.abc');
        userEvent.click(screen.getByText('Button 2'));
        expect(listener1).toBe(1);
        expect(listener2).toBe(1);
    });
    test('should be able to remove event listener with single namespace', () => {
        let times = 0;
        document.body.innerHTML = `
        <button id="btn-2">Button 2</button>
        <button id="btn-3">Button 3</button>`;

        tinyEvents('#btn-2').on('click.btn', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(1);

        tinyEvents('#btn-2').off('.btn');
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(1);
    });
    test('should be able to remove multiple event listeners', () => {
        let times = 0;
        document.body.innerHTML = `
        <button id="btn-2">Button 2</button>`;

        tinyEvents('#btn-2').on('click.abc', () => {
            times++;
        });
        tinyEvents('#btn-2').on('click.xyz', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(2);

        tinyEvents('#btn-2').off('.abc .xyz');
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(2);
    });
    test('should be able to remove event listener with any of the namespaces', () => {
        let times = 0;
        document.body.innerHTML = `
        <button id="btn-2">Button 2</button>
        <button id="btn-3">Button 3</button>`;

        tinyEvents('#btn-2').on('click.btn', () => {
            times++;
        });
        tinyEvents('#btn-2').on('click.btn.utils', () => {
            times++;
        });
        tinyEvents('#btn-3').on('click.btn.utils', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(2);

        tinyEvents('#btn-2').off('.btn');
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(2);

        userEvent.click(screen.getByText('Button 3'));
        expect(times).toBe(3);

        tinyEvents('#btn-3').off('.utils');
        userEvent.click(screen.getByText('Button 3'));
        expect(times).toBe(3);
    });
    test('should be able to remove event listener only from the selected element', () => {
        let times = 0;
        document.body.innerHTML = `
        <button id="btn-2">Button 2</button>
        <button id="btn-3">Button 3</button>`;

        tinyEvents('#btn-2').on('click.btn', () => {
            times++;
        });
        tinyEvents('#btn-3').on('click.btn', () => {
            times++;
        });
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(1);

        tinyEvents('#btn-2').off('.btn');
        userEvent.click(screen.getByText('Button 2'));
        expect(times).toBe(1);

        userEvent.click(screen.getByText('Button 3'));
        userEvent.click(screen.getByText('Button 3'));
        expect(times).toBe(3);

        tinyEvents('#btn-3').off('.btn');

        userEvent.click(screen.getByText('Button 3'));
        userEvent.click(screen.getByText('Button 3'));
        expect(times).toBe(3);
    });

    test('should be able trigger native event', () => {
        document.body.innerHTML = `<button id="btn-1" class="btn">Button 2</button>
        <button id="btn-2" class="btn">Button 3</button>`;

        let times = 0;

        tinyEvents('.btn').on('click.btn', () => {
            times++;
        });
        tinyEvents('#btn-1').trigger('click.btn');
        tinyEvents('#btn-2').trigger('click');

        expect(times).toBe(2);
    });
    test('trigger method should return this if element does not exist', () => {
        const $ = tinyEvents('#btn-does-not-exist').trigger('click');
        expect($).toBeInstanceOf(TinyEvents);
    });
    test('should be able trigger custom event', () => {
        document.body.innerHTML = `<button class="btn">Button 2</button>`;

        let times = 0;

        let detail = '';

        tinyEvents('.btn').on('custom-click.btn', (event: any) => {
            times++;
            detail = event.detail;
        });
        tinyEvents('.btn').trigger('custom-click.btn');
        expect(detail).toBeNull();
        tinyEvents('.btn').trigger('custom-click.btn', {
            type: 'custom-click.btn-detail',
        });
        expect(detail).toEqual({ type: 'custom-click.btn-detail' });
        tinyEvents('.btn').trigger('custom-click', {
            type: 'custom-click-detail',
        });

        expect(detail).toEqual({ type: 'custom-click-detail' });

        expect(times).toBe(3);
    });
});
