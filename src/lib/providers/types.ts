export interface ProviderResult {
  provider: string;
  url: string;
}

/*
 * `quota` separates "this backend is rate-limited / out of free quota" from a
 * generic failure, because the two get different UI: one offers the fallback
 * result, the other is just an error.
 */
export class ProviderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly quota = false,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
