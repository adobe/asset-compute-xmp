<!--- when a new release happens, the VERSION and URL in the badge have to be manually updated because it's a private registry --->
[![Version](https://img.shields.io/npm/v/@adobe/asset-compute-xmp.svg)](https://npmjs.org/package/@adobe/asset-compute-xmp)

- [asset-compute-xmp](#asset-compute-xmp)
  - [Installation](#installation)
  - [API Details](#api-details)
    - [Serialize simple name/value pairs](#serialize-simple-namevalue-pairs)
    - [Serialize an ordered sequence of values](#serialize-an-ordered-sequence-of-values)
    - [Serialize an unordered set of values](#serialize-an-unordered-set-of-values)
    - [Serialize a nested structure](#serialize-a-nested-structure)
    - [Serialize namespaced properties](#serialize-namespaced-properties)
  - [License and Contributing Guidelines](#license-and-contributing-guidelines)

# asset-compute-xmp

Metadata XMP serialization used by custom Adobe Asset Compute serverless actions

## Installation

```bash
npm install @adobe/asset-compute-xmp
```

## API Details

### Serialize simple name/value pairs

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  key1: true,
  key2: false,
  key3: new Date(),
  key4: 123,
  key5: "text",
  key6: "http://www.adobe.com"
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description>
    <key1>True</key1>
    <key2>False</key2>
    <key3>2020-08-25T16:07:36.341Z</key3>
    <key4>123</key4>
    <key5>text</key5>
    <key6 rdf:resource="http://www.adobe.com"/>
  </rdf:Description>
</rdf:RDF>
```

### Serialize an ordered sequence of values

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  key: [ "value1", "value2", "value3" ]
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description>
    <key>
      <rdf:Seq>
        <rdf:li>value1</rdf:li>
        <rdf:li>value2</rdf:li>
        <rdf:li>value3</rdf:li>
      </rdf:Seq>
    </key>
  </rdf:Description>
</rdf:RDF>
```

### Serialize an unordered set of values

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  key: [ "value1", "value2", "value3" ]
}, {
  xmpBags: [ "key" ]
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description>
    <key>
      <rdf:Bag>
        <rdf:li>value1</rdf:li>
        <rdf:li>value2</rdf:li>
        <rdf:li>value3</rdf:li>
      </rdf:Bag>
    </key>
  </rdf:Description>
</rdf:RDF>
```

### Serialize a nested structure

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  key1: {
    key2: "value"
  }
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description>
    <key1>
      <rdf:Description>
        <key2>value</key2>
      </rdf:Description>
    </key1>
  </rdf:Description>
</rdf:RDF>
```

### Serialize namespaced properties

```javascript
const { serializeXmp } = require("@adobe/asset-compute-xmp");
console.log(serializeXmp({
  "ns1:key1": true,
  "ns1:key2": [ "value1", "value2" ],
  "ns1:key3": {
    "ns2:key1": "value3"
  }
}, {
  namespaces: {
    ns1: "http://namespace1",
    ns2: "http://namespace2"
  }
}));
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns1="http://namespace1" xmlns:ns2="http://namespace2">
  <rdf:Description>
    <ns1:key1>True</ns1:key1>
    <ns1:key2>
      <rdf:Seq>
        <rdf:li>value1</rdf:li>
        <rdf:li>value2</rdf:li>
      </rdf:Seq>
    </ns1:key2>
    <ns1:key3>
      <rdf:Description>
        <ns2:key1>value3</ns2:key1>
      </rdf:Description>
    </ns1:key3>
  </rdf:Description>
</rdf:RDF>
```

## License and Contributing Guidelines

- [License](./LICENSE)
- [Contributing Guildelines](./.github/CONTRIBUTING.md)
