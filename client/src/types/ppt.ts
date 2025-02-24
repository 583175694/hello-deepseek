export interface AipptIframeType {
  show: (options: {
    appkey: string;
    channel: string;
    code: string;
    editorModel: boolean;
    onMessage: (eventType: string, data: any) => void;
  }) => Promise<void>;
}
