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
   * Requires options.normalize = true.
   *
   * @default { stripWWW: false, stripHash: true, removeQueryParameters: true, removeTrailingSlash: false }
   */
  readonly normalizeOptions?: NormalizeOptions;

  /**
   * Make an educated guess using other clues if canonical isn't explicitly set in the page's <head>.
   *
   * @default false
   */
  readonly guess?: boolean;
};

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
export default function canonicalUrl(options?: Options): string | undefined;
