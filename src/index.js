import normalizeUrl from "normalize-url";

export default function canonicalUrl(options) {
  options = {
    normalize: false,
    normalizeOptions: {
      // A few sensible normalize-url defaults:
      // https://github.com/sindresorhus/normalize-url#options
      stripWWW: false,
      stripHash: true,
      removeQueryParameters: true,
      removeTrailingSlash: false,
    },
    guess: false,
    ...options,
  };

  // Start with a blank slate
  let url = undefined;

  // Look for a <link rel="canonical"> tag in the page's <head>
  const linkElement = document.head.querySelector("link[rel='canonical']");

  if (linkElement !== null) {
    // Easy peasy, there was a <link rel="canonical"> tag!
    url = linkElement.href;
  } else if (options.guess) {
    // We've been told to make an educated guess if canonical isn't explicitly set
    url = document.documentURI || document.URL || window.location.href;
  }

  if (options.normalize) {
    // Pass either custom options or defaults (above) directly to normalize-url
    url = normalizeUrl(url, options.normalizeOptions);
  }

  // Some sort of URL has been determined by this point, unless it's impossible
  return url;
}
