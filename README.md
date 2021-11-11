# 🔗 get-canonical-url

[![CI](https://github.com/jakejarvis/get-canonical-url/actions/workflows/ci.yml/badge.svg)](https://github.com/jakejarvis/get-canonical-url/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/get-canonical-url)](https://www.npmjs.com/package/get-canonical-url)

Determines the current page's canonical URL and optionally normalizes it via [normalize-url](https://github.com/sindresorhus/normalize-url) for consistency.

## Install

```sh
npm install get-canonical-url
# or...
yarn add get-canonical-url
```

Or pull directly from [unpkg](https://unpkg.com/browse/get-canonical-url/) in-browser:

```html
<script src="https://unpkg.com/get-canonical-url/dist/get-canonical-url.min.js"></script>
```

## Usage

### With `<link rel="canonical">`

```html
<!doctype html>
<html>
<head>
  <link rel="canonical" href="https://www.example.com/this/doesnt/exist.aspx?no=really&it=doesnt#gocheck">
</head>
</html>
```

```js
import canonicalUrl from "get-canonical-url";

canonicalUrl();
//=> 'https://www.example.com/this/doesnt/exist.aspx?no=really&it=doesnt#gocheck'

canonicalUrl({
  normalize: true,
  normalizeOptions: {
    stripProtocol: true,
    stripWWW: true,
    stripHash: true
  }
})
//=> 'example.com/this/doesnt/exist.aspx?it=doesnt&no=really'
```

### Without `<link rel="canonical">`

```js
import canonicalUrl from "get-canonical-url";

canonicalUrl({
  guess: true,
  normalize: true
});
//=> Determined via the individual user's window.location.href or other similar browser hints. Normalizing is recommended.
```

## API

### canonicalUrl(options?)

#### options

Type: `object`

##### normalize

Type: `boolean`\
Default: `false`

Clean-up and normalize the determined canonical URL.

##### normalizeOptions

Type: [`NormalizeOptions`](https://github.com/sindresorhus/normalize-url/blob/main/index.d.ts)\
Default:

```js
{
  stripWWW: false,
  stripHash: true,
  removeQueryParameters: true,
  removeTrailingSlash: false
}
```

Options passed directly to [`normalize-url`](https://github.com/sindresorhus/normalize-url#options).

Requires `options.normalize = true`.

##### guess

Type: `boolean`\
Default: `false`

Make an educated guess using other clues if canonical isn't explicitly set in the page's `<head>`.

## License

MIT
