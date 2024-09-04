import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import PrivacyLink from '../Telas/PrivacyLink';

const Register = () => {
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleRegister = async() => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Correção aqui
           // Alert.alert('Cadastro bem-sucedido!', `Bem-vindo, ${userCredential.user.email}`);
            navigation.navigate('Home');  // Ajuste conforme necessário
        } catch (error) {
            Alert.alert('Erro ao cadastrar', error.message);
        }
};


    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ color: '#FFF', fontSize: 30 }}>App de lista de compras</Text>
            </View>

            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://i.pinimg.com/736x/3e/bf/39/3ebf39757e5a79e24940cbbb48fed06f.jpg' }}
                    style={styles.logo}
                />
            </View>

            <View style={{alignItems:'center', justifyContent:'center', marginTop:30}}>
                <Text style={{fontSize:25, fontWeight:'bold', fontStyle:'italic', color:'#FFF'}}>Cadastro</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="flat"
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode='flat'
                    secureTextEntry
                    style={styles.input}
                />
                <Pressable style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 10 }} onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#0098E0' }}>Você já tem conta? Faça seu Login agora!</Text>
                </Pressable>
                <Button
                    mode="contained"
                    onPress={handleRegister}
                    style={styles.button}
                >
                    Cadastro
                </Button>
                
           


                <Pressable style={{ marginTop: 50, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('Tela Inicial')}>
                    <Text style={{ color: '#E04B00' }}>Voltar para tela inicial</Text>
                </Pressable>

                <View style={{alignItems:'center', marginTop:40}}>
               <PrivacyLink/>
               </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2e2e2e',
    },
    form: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 60,
        marginTop:20
    },
    input: {
        marginBottom: 15,
    },
    logoContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    logo: {
        height: 275,
        width: '90%',
        borderRadius: 30,
    },
    button: {
        marginTop: 10,
    },
  
});

export default Register;
