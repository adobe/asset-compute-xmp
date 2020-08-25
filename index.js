/**
 *  ADOBE CONFIDENTIAL
 *  __________________
 *
 *  Copyright 2020 Adobe
 *  All Rights Reserved.
 *
 *  NOTICE:  All information contained herein is, and remains
 *  the property of Adobe Systems Incorporated and its suppliers,
 *  if any.  The intellectual and technical concepts contained
 *  herein are proprietary to Adobe Systems Incorporated and its
 *  suppliers and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Adobe Systems Incorporated.
 */

 "use strict";

const { create } = require("xmlbuilder2");
const isObject = require("isobject");

const RDF_BAG = "rdf:Bag";
const RDF_DESCRIPTION = "rdf:Description";
const RDF_LI = "rdf:li";
const RDF_RDF = "rdf:RDF";
const RDF_SEQ = "rdf:Seq";
const RDF_XML_NAMESPACE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

/**
 * @typedef {Object} XmpSerializationOptions
 * @property {Object} [namespaces] Namespace prefix: url definitions
 * @property {String[]} [xmpBags] Property keys that map to an array will be serialized as xmp:Bag instead of xmp:Seq 
 */

/**
 * Convert an array to an rdf:Seq or rdf:Bag
 * See: XMP Specification Part 1 - Chapter 7.7
 * Limitation: Nested arrays are not supported and will return in an Error
 * 
 * @param {*} parent Parent XML element to add the array to
 * @param {Object[]} array Array to serialize
 * @param {Boolean} isBag True if the output should be a rdf:Bag otherwise rdf:Seq
 */
function toXmpArray(parent, array, isBag) {
    let element = parent.ele(isBag ? RDF_BAG : RDF_SEQ);
    for (const value of array) {
        const li = element.ele(RDF_LI);
        if (Array.isArray(value)) {
            throw Error("Nested arrays are not supported");
        } else if (isObject(value)) {
            toXmpStructure(li, value);
        } else {
            li.txt(value);
        }
    }
}

/**
 * Convert an object to an XMP structure
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
            element.txt(value);
        }
    }
}

/**
 * Convert an object to XMP compliant metadata
 * 
 * Arrays are converted to ordered arrays (rdf:Seq) by default, but can also be
 * serialized as unordered arrays (rdf:Bag) by providing the key in the `xmpBags`
 * option.
 * 
 * Namespaces can also be provided through the options by providing the prefix as 
 * the key and the URI as the value, e.g. { "xyz": "http://path/to/xyz/schema" }.
 * 
 * Limitations:
 * - rdf:Alt, i.e. alternative arrays, are not supported
 * - Nested arrays are not supported
 * 
 * @param {Object} obj Structure to convert to XMP compliant metadata
 * @param {XmpSerializationOptions} [options] Serialization options
 * @returns {String} Serialized XMP metadata
 */
function toXmp(obj, options) {
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

async function main() {
    console.log(toXmp({
        "dam:name": {
            "dam:xyz": "value"
        }, 
        "dam:array": ["a","b","c"]
    }, {
        namespaces: {
            dam: "http://www.day.com/dam/1.0"
        }
    }));
}

main()
    .catch(e => console.error(e));
