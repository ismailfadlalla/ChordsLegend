import Reactotron, { ReactotronReactNative } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define your custom Reactotron interface
interface CustomReactotron extends ReactotronReactNative {
  customFeature?: {
    log: (message: string) => void;
  };
}

// Configure Reactotron with proper typing
const reactotron = Reactotron
  .configure({
    name: 'ChordsLegend',
    host: 'localhost' // Add your host if needed
  })
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative()
  .use(reactotronRedux())
  .use((tron) => ({
    onCommand: (command) => {
      if (command.type === 'custom') {
        console.log('Custom command received', command.payload);
      }
    },
    features: {
      customLog: (message: string) => tron.log?.(message),
    }
  }))
  .connect() as CustomReactotron;

// Add custom features
reactotron.customFeature = {
  log: (message) => reactotron.display({ name: 'LOG', value: message })
};

// Extend the Console interface
declare global {
  interface Console {
    tron: CustomReactotron;
  }
}

console.tron = reactotron;

export default reactotron;