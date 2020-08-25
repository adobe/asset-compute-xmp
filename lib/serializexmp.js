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

const { create } = require("xmlbuilder2");
const isObject = require("isobject");
const validUrl = require('valid-url');

const RDF_BAG = "rdf:Bag";
const RDF_DESCRIPTION = "rdf:Description";
const RDF_LI = "rdf:li";
const RDF_RDF = "rdf:RDF";
const RDF_RESOURCE = "rdf:resource";
const RDF_SEQ = "rdf:Seq";
const RDF_XML_NAMESPACE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

/**
 * @typedef {Object} XmpSerializationOptions
 * @property {Object} [namespaces] Namespace prefix: url definitions
 * @property {String[]} [xmpBags] Property keys that map to an array will be serialized as xmp:Bag instead of xmp:Seq 
 */

/**
 * Serialize a simple value (e.g. string, number, boolean)
 * See: 
 * - XMP Specification Part 1 - Chapter 7.5
 * - XMP Specification Part 1 - Chapter 8.2
 * 
 * @param {*} parent Parent XML element to add the simple value to
 * @param {String|Number} value Simple value
 */
function toXmpSimple(parent, value) {
    if (value === true) {
        parent.txt("True"); // Boolean 8.2.1.1
    } else if (value === false) {
        parent.txt("False"); // Boolean 8.2.1.1
    } else if (typeof value.toISOString === "function") {
        parent.txt(value.toISOString()); // Date (8.2.1.2)
    } else if (validUrl.isUri(value)) {
        parent.att(RDF_XML_NAMESPACE, RDF_RESOURCE, value);
    } else {
        parent.txt(value); // Integer, Real, Text
    }
}

/**
 * Serialize an array to a ordered sequence (rdf:Seq) or unordered set (rdf:Bag)
 * See: XMP Specification Part 1 - Chapter 7.7
 * Limitation: Nested arrays are not supported and will return in an Error
 * 
 * @param {*} parent Parent XML element to add the array to
 * @param {Object[]} array Array to serialize
 * @param {Boolean} isBag True if the output should be a rdf:Bag otherwise rdf:Seq
 */
function toXmpArray(parent, array, isBag) {
    const element = parent.ele(isBag ? RDF_BAG : RDF_SEQ);
    for (const value of array) {
        const li = element.ele(RDF_LI);
        if (Array.isArray(value)) {
            throw Error("Nested arrays are not supported");
        } else if (isObject(value)) {
            toXmpStructure(li, value);
        } else {
            toXmpSimple(li, value);
        }
    }
}

/**
 * Serialize an object to a XMP structure
 * See: XMP Specification Part 1 - Chapter 7.6
 * 
 * @param {*} parent Parent XML element to add the structure to
 * @param {Object} obj Structure to serialize
 * @param {XmpSerializationOptions} [options] Serialization options
 */
function toXmpStructure(parent, obj, options) {
    const xmpBags = (options && options.xmpBags) || [];
    const rdfDescription = parent.ele(RDF_DESCRIPTION);
    for (const [key, value] of Object.entries(obj)) {
        const element = rdfDescription.ele(key);
        if (Array.isArray(value)) {
            const isBag = xmpBags.indexOf(key) >= 0;
            toXmpArray(element, value, isBag);
        } else if (isObject(value)) {
            toXmpStructure(element, value);
        } else {
            toXmpSimple(element, value);
        }
    }
}

/**
 * Serialize an object to XMP compliant metadata in canonical form.
 * 
 * Arrays are converted to ordered arrays (rdf:Seq) by default, but can also be
 * serialized as unordered arrays (rdf:Bag) by providing the key in the `xmpBags`
 * option.
 * 
 * Namespaces can also be provided through the options by providing the prefix as 
 * the key and the URI as the value, e.g. { "xyz": "http://path/to/xyz/schema" }.
 * 
 * Dates are detected by the presence of the .toISOString() method in the value.
 * This allows them to be passed as follows: { "date": new Date() }
 * 
 * Limitations:
 * - Alternative arrays (rdf:Alt) are not supported
 * - Nested arrays are not supported
 * - Qualifiers, including xml:lang, are not supported
 * - Resource References are not supported
 * 
 * @param {Object} obj Structure to convert to XMP compliant metadata
 * @param {XmpSerializationOptions} [options] Serialization options
 * @returns {String} Serialized XMP metadata
 */
function serializeXmp(obj, options) {
    const root = create({ encoding: "UTF-8" });
    const rdf = root.ele(RDF_XML_NAMESPACE, RDF_RDF);

    // add custom namespace definitions
    const namespaces = options && options.namespaces;
    if (namespaces) {
        for (const [prefix, url] of Object.entries(namespaces)) {
            rdf.att(`xmlns:${prefix}`, url);
        }    
    }

    // convert structure and produce well-formed XML
    toXmpStructure(rdf, obj);
    return root.toString({ prettyPrint: true, wellFormed: true });
}

module.exports = {
    serializeXmp
};