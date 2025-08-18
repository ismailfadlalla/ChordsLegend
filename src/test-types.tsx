import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// Simple test component to verify TypeScript types are working
export const TypesTest: React.FC = () => {
  return (
    <View>
      <Text>Hello</Text>
      <TouchableOpacity>
        <Text>Button</Text>
      </TouchableOpacity>
      <TextInput placeholder="Test" />
    </View>
  );
};
