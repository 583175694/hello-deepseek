declare module "mammoth" {
  interface ConversionOptions {
    arrayBuffer: ArrayBuffer;
    styleMap?: string[];
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    convertImage?: (image: any) => Promise<{ src: string }>;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
  }

  interface ConversionResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
      error?: Error;
    }>;
  }

  function convertToHtml(options: ConversionOptions): Promise<ConversionResult>;

  export { convertToHtml };
  export default { convertToHtml };
}
