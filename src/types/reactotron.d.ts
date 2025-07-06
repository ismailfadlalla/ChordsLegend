import type { Reactotron } from 'reactotron-core-client';

declare module 'reactotron-react-native' {
  interface ReactotronReactNative extends Reactotron {
    configure(options?: {
      name?: string;
      host?: string;
      port?: number;
    }): ReactotronReactNative;
    use: (plugin: (tron: ReactotronReactNative) => ReactotronReactNative) => ReactotronReactNative;
    connect: () => ReactotronReactNative;
  }
  const instance: ReactotronReactNative;
  export default instance;
}

declare module 'reactotron-redux' {
  import type { ReactotronReactNative } from 'reactotron-react-native';
  export function reactotronRedux(): (tron: ReactotronReactNative) => ReactotronReactNative;
}