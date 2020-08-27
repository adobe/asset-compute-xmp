[![Version](https://img.shields.io/npm/v/@adobe/asset-compute-xmp.svg)](https://npmjs.org/package/@adobe/asset-compute-xmp)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![codecov](https://codecov.io/gh/adobe/asset-compute-xmp/branch/master/graph/badge.svg)](https://codecov.io/gh/adobe/asset-compute-xmp)
[![Travis](https://travis-ci.com/adobe/asset-compute-xmp.svg?branch=master)](https://travis-ci.com/adobe/asset-compute-xmp)

- [asset-compute-xmp](#asset-compute-xmp)
  - [Installation](#installation)
  - [API Details](#api-details)
    - [Limitations](#limitations)
    - [Serialize simple name/value pairs](#serialize-simple-namevalue-pairs)
    - [Serialize an ordered sequence of values](#serialize-an-ordered-sequence-of-values)
    - [Serialize an unordered set of values](#serialize-an-unordered-set-of-values)
    - [Serialize a nested structure](#serialize-a-nested-structure)
  - [License and Contributing Guidelines](#license-and-contributing-guidelines)

# asset-compute-xmp

Metadata XMP serialization used by custom Adobe Asset Compute serverless actions.

## Installation

```bash
npm install @adobe/asset-compute-xmp
```

## API Details

### Limitations

- Alternative arrays, `rdf:Alt`, are not supported
- Nested arrays are not supported
- Qualifiers, including `xml:lang`, are not supported
- Resource references are not supported

### Serialize simple name/value pairs

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  "ns1:key1": true,
  "ns1:key2": false,
  "ns1:key3": new Date(),
  "ns1:key4": 123,
  "ns1:key5": "text",
  "ns1:key6": "http://www.adobe.com"
}, {
  namespaces: {
    ns1: "https://example.com/schema/example"
  }
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="https://example.com/schema/example">
  <rdf:Description>
    <ns1:key1>True</ns1:key1>
    <ns1:key2>False</ns1:key2>
    <ns1:key3>2020-08-26T17:38:29.991Z</ns1:key3>
    <ns1:key4>123</ns1:key4>
    <ns1:key5>text</ns1:key5>
    <ns1:key6 rdf:resource="http://www.adobe.com"/>
  </rdf:Description>
</rdf:RDF>
```

### Serialize an ordered sequence of values

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  "ns1:key": [ "value1", "value2", "value3" ]
}, {
  namespaces: {
    ns1: "https://example.com/schema/example"
  }
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="https://example.com/schema/example">
  <rdf:Description>
    <ns1:key>
      <rdf:Seq>
        <rdf:li>value1</rdf:li>
        <rdf:li>value2</rdf:li>
        <rdf:li>value3</rdf:li>
      </rdf:Seq>
    </ns1:key>
  </rdf:Description>
</rdf:RDF>
```

### Serialize an unordered set of values

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  "ns1:key": [ "value1", "value2", "value3" ]
}, {
  namespaces: {
    ns1: "https://example.com/schema/example"
  },
  xmpBags: [ "ns1:key" ]
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="https://example.com/schema/example">
  <rdf:Description>
    <ns1:key>
      <rdf:Bag>
        <rdf:li>value1</rdf:li>
        <rdf:li>value2</rdf:li>
        <rdf:li>value3</rdf:li>
      </rdf:Bag>
    </ns1:key>
  </rdf:Description>
</rdf:RDF>
```

### Serialize a nested structure

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  "ns1:key1": {
    "ns1:key2": "value"
  }
}, {
  namespaces: {
    ns1: "https://example.com/schema/example"
  }
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="https://example.com/schema/example">
  <rdf:Description>
    <ns1:key1>
      <rdf:Description>
        <ns1:key2>value</ns1:key2>
      </rdf:Description>
    </ns1:key1>
  </rdf:Description>
</rdf:RDF>
```

## License and Contributing Guidelines

- [License](./LICENSE)
- [Contributing Guildelines](./.github/CONTRIBUTING.md)
