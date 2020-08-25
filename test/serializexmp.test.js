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
        it("nested-array", () => {
            assert.throws(() => {
                serializeXmp({
                    "key": [ [123] ]
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
    describe("sequence", () => {
        it("undefined", () => {
            const xmp = serializeXmp({
                "key": [ undefined ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq/></key></rdf:Description></rdf:RDF>');
        });
        it("null", () => {
            const xmp = serializeXmp({
                "key": [ null ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq/></key></rdf:Description></rdf:RDF>');
        });
        it("boolean", () => {
            const xmp = serializeXmp({
                "key": [ true, false ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq><rdf:li>True</rdf:li><rdf:li>False</rdf:li></rdf:Seq></key></rdf:Description></rdf:RDF>');
        });
        it("integer", () => {
            const xmp = serializeXmp({
                "key": [ 1234 ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq><rdf:li>1234</rdf:li></rdf:Seq></key></rdf:Description></rdf:RDF>');
        });
        it("real", () => {
            const xmp = serializeXmp({
                "key": [ 123.45 ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq><rdf:li>123.45</rdf:li></rdf:Seq></key></rdf:Description></rdf:RDF>');
        });
        it("text", () => {
            const xmp = serializeXmp({
                "key": [ "text" ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq><rdf:li>text</rdf:li></rdf:Seq></key></rdf:Description></rdf:RDF>');
        });
        it("uri", () => {
            const xmp = serializeXmp({
                "key": [ "http://www.adobe.com" ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq><rdf:li rdf:resource="http://www.adobe.com"/></rdf:Seq></key></rdf:Description></rdf:RDF>');
        });
        it("date", () => {
            const epoch = new Date();
            epoch.setTime(0);
            const xmp = serializeXmp({
                "key": [ epoch ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Seq><rdf:li>1970-01-01T00:00:00.000Z</rdf:li></rdf:Seq></key></rdf:Description></rdf:RDF>');
        });
    });
    describe("bag", () => {
        it("top-level", () => {
            const xmp = serializeXmp({
                "key": [ 123, "text", null, true, undefined, false ]
            }, {
                xmpBags: [ "key" ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><key><rdf:Bag><rdf:li>123</rdf:li><rdf:li>text</rdf:li><rdf:li>True</rdf:li><rdf:li>False</rdf:li></rdf:Bag></key></rdf:Description></rdf:RDF>');    
        });
        it("nested-struct", () => {
            const xmp = serializeXmp({
                "top": {
                    key: [ 123, "text", null, true, undefined, false ]
                }
            }, {
                xmpBags: [ "key" ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><top><rdf:Description><key><rdf:Bag><rdf:li>123</rdf:li><rdf:li>text</rdf:li><rdf:li>True</rdf:li><rdf:li>False</rdf:li></rdf:Bag></key></rdf:Description></top></rdf:Description></rdf:RDF>');
        });
        it("nested-struct-array", () => {
            const xmp = serializeXmp({
                "top": [{
                    key: [ 123, "text", null, true, undefined, false ]
                }]
            }, {
                xmpBags: [ "key" ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description><top><rdf:Seq><rdf:li><rdf:Description><key><rdf:Bag><rdf:li>123</rdf:li><rdf:li>text</rdf:li><rdf:li>True</rdf:li><rdf:li>False</rdf:li></rdf:Bag></key></rdf:Description></rdf:li></rdf:Seq></top></rdf:Description></rdf:RDF>');
        });
    });
    describe("namespaces", () => {
        it("simple", () => {
            const xmp = serializeXmp({
                "ns1:key": "value"
            }, {
                namespaces: {
                    ns1: "http://ns1.com"
                }
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="http://ns1.com"><rdf:Description><ns1:key>value</ns1:key></rdf:Description></rdf:RDF>');
        });
        it("struct", () => {
            const xmp = serializeXmp({
                "ns1:key1": {
                    "ns1:key2": "value"
                }
            }, {
                namespaces: {
                    ns1: "http://ns1.com"
                }
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="http://ns1.com"><rdf:Description><ns1:key1><rdf:Description><ns1:key2>value</ns1:key2></rdf:Description></ns1:key1></rdf:Description></rdf:RDF>');
        });
        it("sequence", () => {
            const xmp = serializeXmp({
                "ns1:key1": [ "value" ]
            }, {
                namespaces: {
                    ns1: "http://ns1.com"
                }
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="http://ns1.com"><rdf:Description><ns1:key1><rdf:Seq><rdf:li>value</rdf:li></rdf:Seq></ns1:key1></rdf:Description></rdf:RDF>');
        });
        it("bag", () => {
            const xmp = serializeXmp({
                "ns1:key1": [ "value" ]
            }, {
                namespaces: {
                    ns1: "http://ns1.com"
                },
                xmpBags: [ "ns1:key1" ]
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="http://ns1.com"><rdf:Description><ns1:key1><rdf:Bag><rdf:li>value</rdf:li></rdf:Bag></ns1:key1></rdf:Description></rdf:RDF>');
        });
        it("nested-struct", () => {
            const xmp = serializeXmp({
                "ns1:key": {
                    "ns2:key": "value"
                }
            }, {
                namespaces: {
                    ns1: "http://ns1.com",
                    ns2: "http://ns2.com"
                }
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="http://ns1.com" xmlns:ns2="http://ns2.com"><rdf:Description><ns1:key><rdf:Description><ns2:key>value</ns2:key></rdf:Description></ns1:key></rdf:Description></rdf:RDF>');
        });
        it("nested-sequence", () => {
            const xmp = serializeXmp({
                "ns1:key": [{
                    "ns2:key": "value"
                }]
            }, {
                namespaces: {
                    ns1: "http://ns1.com",
                    ns2: "http://ns2.com"
                }
            });
            assert.strictEqual(xmp, '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="http://ns1.com" xmlns:ns2="http://ns2.com"><rdf:Description><ns1:key><rdf:Seq><rdf:li><rdf:Description><ns2:key>value</ns2:key></rdf:Description></rdf:li></rdf:Seq></ns1:key></rdf:Description></rdf:RDF>');
        });
    });
});