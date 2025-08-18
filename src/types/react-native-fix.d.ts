// Fix for React Native JSX component types
declare module 'react-native' {
  import { ComponentType } from 'react';
  
  // Re-export React Native components as valid JSX components
  export const View: ComponentType<any>;
  export const Text: ComponentType<any>;
  export const TextInput: ComponentType<any>;
  export const TouchableOpacity: ComponentType<any>;
  export const ScrollView: ComponentType<any>;
  export const SafeAreaView: ComponentType<any>;
  export const FlatList: ComponentType<any>;
  export const Image: ComponentType<any>;
  export const Button: ComponentType<any>;
  export const Pressable: ComponentType<any>;
  export const ActivityIndicator: ComponentType<any>;
  export const Modal: ComponentType<any>;
  export const Switch: ComponentType<any>;
  export const Alert: any;
  export const Platform: any;
  export const Dimensions: any;
  export const StyleSheet: any;
  export const Animated: any;
  export const Linking: any;
  export const StatusBar: ComponentType<any>;
}
