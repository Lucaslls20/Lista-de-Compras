import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PrivacyLink = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Politica de Privacidade')}>
      <Text style={styles.linkText}>Política de Privacidade</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});

export default PrivacyLink;
