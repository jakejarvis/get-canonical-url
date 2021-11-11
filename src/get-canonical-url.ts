/*! get-canonical-url | MIT | https://github.com/jakejarvis/get-canonical-url */
import normalizeUrl from "normalize-url";
import type { Options as NormalizeOptions } from "normalize-url";

export interface Options {
  /**
   * Clean-up and normalize the determined canonical URL.
   *
   * @default false
   */
  readonly normalize?: boolean;

  /**
   * Options passed directly to [`normalize-url`](https://github.com/sindresorhus/normalize-url#options).
   *
   * Requires `options.normalize = true`.
   *
   * @default { stripWWW: false, stripHash: true, removeQueryParameters: true, removeTrailingSlash: false }
   */
  readonly normalizeOptions?: NormalizeOptions;

  /**
   * Make an educated guess using other clues if canonical isn't explicitly set in the page's `<head>`.
   *
   * @default false
   */
  readonly guess?: boolean;
}

/**
 * Returns the current page's canonical URL.
 *
 * @example
 * ```
 * // This imaginary page's <head> contains the following link tag:
 * //   <link rel="canonical" href="https://www.example.com/" />
 *
 * import canonicalUrl from "get-canonical-url";
 *
 * canonicalUrl();
 * //=> 'https://www.example.com/'
 * ```
 */
export default function canonicalUrl(options: Options = {}): string | undefined {
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
  let url: string | undefined = undefined;

  // Look for a <link rel="canonical"> tag in the page's <head>
  const linkElement: HTMLLinkElement | null = document.head.querySelector("link[rel='canonical']");

  if (linkElement !== null) {
    // Easy peasy, there was a <link rel="canonical"> tag!
    url = linkElement.href;
  } else if (options.guess) {
    // We've been told to make an educated guess if canonical isn't explicitly set
    url = document.documentURI || document.URL || window.location.href;
  }

  if (url && options.normalize) {
    // Pass either custom options or defaults (above) directly to normalize-url
    url = normalizeUrl(url, options.normalizeOptions);
  }

  // Some sort of URL has been determined by this point, unless it's impossible
  return url;
}
