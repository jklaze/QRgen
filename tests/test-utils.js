import test from 'node:test';
import assert from 'node:assert';
import { parseHTML } from '../src/components/utils.js';

test('parseHTML parses html securely using DOMParser', () => {
    let parseFromStringCalled = false;
    let parsedHtml = '';

    global.DOMParser = class {
        parseFromString(html, mimeType) {
            parseFromStringCalled = true;
            parsedHtml = html;
            assert.strictEqual(mimeType, 'text/html');

            return {
                body: {
                    firstChild: { nodeName: 'DIV', textContent: 'hello' }
                }
            };
        }
    };

    let createDocumentFragmentCalled = false;
    global.document = {
        createDocumentFragment() {
            createDocumentFragmentCalled = true;
            return {
                appendChild(node) {
                    this.firstChild = node;
                    // remove firstChild from doc.body to break the while loop
                    global.document._bodyFirstChild = null;
                }
            };
        }
    };

    // Override the mock's body.firstChild so we can mutate it
    const mockDoc = {
        body: {
            get firstChild() {
                return global.document._bodyFirstChild;
            }
        }
    };

    global.document._bodyFirstChild = { nodeName: 'DIV', textContent: 'hello' };

    global.DOMParser = class {
        parseFromString(html, mimeType) {
            parseFromStringCalled = true;
            parsedHtml = html;
            assert.strictEqual(mimeType, 'text/html');
            return mockDoc;
        }
    };

    const fragment = parseHTML('  <div>hello</div>  ');

    assert.strictEqual(parseFromStringCalled, true);
    assert.strictEqual(parsedHtml, '<div>hello</div>'); // trimmed
    assert.strictEqual(createDocumentFragmentCalled, true);
    assert.strictEqual(fragment.firstChild.nodeName, 'DIV');
    assert.strictEqual(fragment.firstChild.textContent, 'hello');

    delete global.DOMParser;
    delete global.document;
});
