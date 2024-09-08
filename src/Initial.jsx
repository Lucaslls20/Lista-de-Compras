import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Pressable, Animated } from 'react-native';
import { Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Inicial = () => {
  const navigation = useNavigation();

  // Função para animar tremor
  const shakeAnimation = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Ref para os valores de animação dos botões
  const buttonScale1 = useRef(new Animated.Value(1)).current;
  const buttonScale2 = useRef(new Animated.Value(1)).current;

  // Ref para os valores de animação dos ícones
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;

  // Ref e animação da logo
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse()); // Loop da animação
    };

    pulse(); // Inicia a animação de pulso
  }, [pulseAnim]);

  const animateButton = (scaleAnim) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bem-vindo ao ListaFácil</Text>
        </View>

        <View style={styles.logoContainer}>
          <Animated.Image
            style={[styles.logo, { transform: [{ scale: pulseAnim }] }]} // Animação de pulso
            source={{ uri: 'https://i.pinimg.com/736x/3e/bf/39/3ebf39757e5a79e24940cbbb48fed06f.jpg' }}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Com este App você nunca mais irá esquecer o que comprar!</Text>
        </View>

        <View style={styles.innerContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale1 }], width:'100%', marginRight:5 }}>
            <Button
              onPress={() => {
                animateButton(buttonScale1);
                navigation.navigate('Login');
              }}
              mode='contained'
              style={styles.buttonContained}
            >
              <Text style={{ fontSize: 18, color: '#FFF' }}>Login</Text>
            </Button>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: buttonScale2 }], width:'100%', marginRight:5 }}>
            <Button
              onPress={() => {
                animateButton(buttonScale2);
                navigation.navigate('Registro');
              }}
              mode='contained'
              style={styles.buttonOutlined}
            >
              <Text style={{ fontSize: 18, color: '#FFF' }}>Registro</Text>
            </Button>
          </Animated.View>
        </View>

        <View style={styles.iconContainer}>
          <Pressable onPress={() => shakeAnimation(animatedValue1)}>
            <Animated.Image
              style={[styles.icon, { transform: [{ translateX: animatedValue1.interpolate({
                inputRange: [-1, 1],
                outputRange: [-5, 5],
              }) }] }]}
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSouW3_9DQVCVUjLKyHmqXbp8lghQyNiyTxIA&s' }}
            />
          </Pressable>

          <Pressable onPress={() => shakeAnimation(animatedValue2)}>
            <Animated.Image
              style={[styles.icon, { transform: [{ translateX: animatedValue2.interpolate({
                inputRange: [-1, 1],
                outputRange: [-5, 5],
              }) }] }]}
              source={{ uri: 'https://st5.depositphotos.com/1001877/65791/i/1600/depositphotos_657912818-stock-photo-shopping-basket-fresh-food-grocery.jpg' }}
            />
          </Pressable>

          <Pressable onPress={() => shakeAnimation(animatedValue3)}>
            <Animated.Image
              style={[styles.icon, { transform: [{ translateX: animatedValue3.interpolate({
                inputRange: [-1, 1],
                outputRange: [-5, 5],
              }) }] }]}
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7835/7835565.png' }}
            />
          </Pressable>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Versão 1.0</Text>
          <Text style={styles.footerTextBold}>Bem-vindo!</Text>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '90%',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#e0e7ff',
    marginBottom: 20,
    borderRadius: 15,
    marginTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202453',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 25,
  },
  logo: {
    height: 125,
    borderRadius: 50,
    width: 270,
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#333',
  },
  innerContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContained: {
    margin: 10,
    width: '100%',
    backgroundColor: '#4b72ff',
  },
  buttonOutlined: {
    margin: 10,
    width: '100%',
    backgroundColor: '#4b72ff',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  footerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#626AEB',
    fontWeight: '600',
  },
  footerTextBold: {
    fontWeight: 'bold',
    color: '#626AEB',
  },
});

export default Inicial;
