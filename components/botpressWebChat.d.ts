export {}

declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void
      sendEvent: (event: any) => void
    }
  }
}
