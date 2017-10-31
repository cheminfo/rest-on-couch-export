# rest-on-couch-export

  [![NPM version][npm-image]][npm-url]
  [![npm download][download-image]][download-url]

Export entries and attachments from a rest-on-couch instance.

## Installation

`$ npm install -g rest-on-couch-export`

## Usage

### Export a single user

`rest-on-couch-export user <email> | all options`

### Options

#### `-u, --url`

URL to the rest-on-couch database.

#### `-o, --out`

Output directory

#### `-t, --token`

User token to access private data

## Example

`rest-on-couch-export all -u "http://localhost/roc/db/eln" -t "your token here" -o /tmp/export`

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/rest-on-couch-export.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rest-on-couch-export
[download-image]: https://img.shields.io/npm/dm/rest-on-couch-export.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/rest-on-couch-export
