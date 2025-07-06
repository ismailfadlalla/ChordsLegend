declare namespace NodeJS {
  interface Global {
    __DEV__: boolean;
    atob: (encoded: string) => string;
    btoa: (raw: string) => string;
  }
}
