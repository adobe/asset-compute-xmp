/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

"use strict";

const { serializeXmp } = require("../index");
const assert = require("assert");

describe("serializexmp", () => {
    describe("invalid", () => {
        it("function", () => {
            assert.throws(() => {
                serializeXmp({
                    "key": () => {},
                });
            }, Error);
        });
    });
    describe("simple", () => {
        it("undefined", () => {
            const xmp = serializeXmp({
                "key": undefined
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description/></rdf:RDF>');
        });
        it("null", () => {
            const xmp = serializeXmp({
                "key": null
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description/></rdf:RDF>');
        });
        it("boolean", () => {
            const xmp = serializeXmp({
                "key1": true,
                "key2": false
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key1>True</key1><key2>False</key2></rdf:Description></rdf:RDF>');
        });
        it("integer", () => {
            const xmp = serializeXmp({
                "key": 1234
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key>1234</key></rdf:Description></rdf:RDF>');
        });
        it("real", () => {
            const xmp = serializeXmp({
                "key": 123.45
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key>123.45</key></rdf:Description></rdf:RDF>');
        });
        it("text", () => {
            const xmp = serializeXmp({
                "key": "text"
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key>text</key></rdf:Description></rdf:RDF>');
        });
        it("uri", () => {
            const xmp = serializeXmp({
                "key": "http://www.adobe.com"
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key rdf:resource="http://www.adobe.com"/></rdf:Description></rdf:RDF>');
        });
        it("date", () => {
            const epoch = new Date();
            epoch.setTime(0);
            const xmp = serializeXmp({
                "key": epoch 
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key>1970-01-01T00:00:00.000Z</key></rdf:Description></rdf:RDF>');
        });
    });
});

// async function main() {
//     console.log(toXmp({
//         "dam:name": {
//             "dam:xyz": "value"
//         }, 
//         "dam:array": ["a","b","c"],
//         "dam:url": "http://www.adobe.com",
//         "dam:array2": [
//             "http://www.adobe.com",
//             "http://www.adobe.com",
//             "http://www.adobe.com",
//         ]
//     }, {
//         namespaces: {
//             dam: "http://www.day.com/dam/1.0"
//         }
//     }));
// }