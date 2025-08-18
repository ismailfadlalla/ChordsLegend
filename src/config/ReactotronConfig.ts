// Extend the Console interface
declare global {
  interface Console {
    tron: any;
  }
}

let reactotron: any;

try {
  const Reactotron = require('reactotron-react-native');
  const { reactotronRedux } = require('reactotron-redux');
  const AsyncStorage = require('@react-native-async-storage/async-storage');

  // Configure Reactotron
  reactotron = Reactotron
    .configure({
      name: 'ChordsLegend',
      host: 'localhost' // Add your host if needed
    })
    .setAsyncStorageHandler(AsyncStorage)
    .useReactNative()
    .use(reactotronRedux())
    .use((tron: any) => ({
      onCommand: (command: any) => {
        if (command.type === 'custom') {
          console.log('Custom command received', command.payload);
        }
      },
      features: {
        customLog: (message: string) => tron.log?.(message),
      }
    }))
    .connect();

  // Add custom features
  (reactotron as any).customFeature = {
    log: (message: string) => (reactotron as any).display?.({ name: 'LOG', value: message }) || console.log(message)
  };

  (console as any).tron = reactotron;

} catch (error) {
  console.warn('Reactotron not available:', error);
  
  // Export a mock Reactotron object
  reactotron = {
    log: (message: string) => console.log('Mock Reactotron:', message),
    display: (config: { name: string; value: any }) => console.log('Mock Reactotron display:', config),
    customFeature: {
      log: (message: string) => console.log('Mock Reactotron custom:', message)
    }
  };

  (console as any).tron = reactotron;
}

export default reactotron;