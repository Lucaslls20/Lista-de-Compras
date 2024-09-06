import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Inicial = () => {

  const navigation = useNavigation();

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bem-vindo ao App de Lista de Compras</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={{ uri: 'https://i.pinimg.com/736x/3e/bf/39/3ebf39757e5a79e24940cbbb48fed06f.jpg' }}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Com este App você nunca mais irá esquecer o que comprar!</Text>
        </View>

        <View style={styles.innerContainer}>
          <Button
            onPress={() => navigation.navigate('Login')}
            mode='contained'
            style={styles.buttonContained}
          >
            Login
          </Button>
          <Button
            onPress={() => navigation.navigate('Registro')}
            mode='contained'
            style={styles.buttonOutlined}
          >
            Registro
          </Button>
        </View>

        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={{ uri: 'https://catracalivre.com.br/cdn-cgi/image/f=auto,q=60,w=1200,h=1200,fit=cover,format=jpeg/wp-content/uploads/2020/03/mecado-livre-campanha-coronavirus-amarelo.png' }}
          />
          <Image
            style={styles.icon}
            source={{ uri: 'https://i0.wp.com/assets.b9.com.br/wp-content/uploads/2020/03/ifood.jpg?fit=1280%2C720&ssl=1' }}
          />
          <Image
            style={styles.icon}
            source={{ uri: 'https://w7.pngwing.com/pngs/221/535/png-transparent-amazon-dark-hd-logo-thumbnail.png' }}
          />
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
    backgroundColor: '#f0f4ff', // Cor de fundo mais suave
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '90%',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#e0e7ff', // Suave
    marginBottom: 20,
    borderRadius: 15,
    marginTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202453', // Contraste para legibilidade
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 25,
  },
  logo: {
    height: 125,
    width: 250,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#333', // Melhor contraste
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
    backgroundColor: '#4b72ff', // Cor mais vibrante
  },
  buttonOutlined: {
    margin: 10,
    width: '100%',
    backgroundColor: '#4b72ff', // Uniforme
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Balancear o layout dos ícones
    marginTop: 20,
    width: '80%',
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 8,
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
