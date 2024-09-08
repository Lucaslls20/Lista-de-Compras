import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Animated, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import PrivacyLink from '../Telas/PrivacyLink';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [scale] = useState(new Animated.Value(1)); // Inicializa o valor de escala
    const [snackbarVisible, setSnackbarVisible] = useState(false); // Estado para controlar a visibilidade da Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Estado para a mensagem da Snackbar
    const navigation = useNavigation();

    const validateFields = () => {
        if (!email || !password) {
            setSnackbarMessage('Por favor, preencha todos os campos');
            setSnackbarVisible(true);
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (validateFields()) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                navigation.navigate('Home');
            } catch (error) {
                setSnackbarMessage(`Erro ao cadastrar: ${error.message}`);
                setSnackbarVisible(true);
            }
        }
    };

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 1.1,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Ajusta a altura no Android
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}  // Desativa o indicador de rolagem
            >
                <View style={styles.container}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <Text style={{ color: '#FFF', fontSize: 30 }}>ListaFácil</Text>
                    </View>

                    <View style={styles.logoContainer}>
                        <Image
                            source={{ uri: 'https://i.pinimg.com/736x/3e/bf/39/3ebf39757e5a79e24940cbbb48fed06f.jpg' }}
                            style={styles.logo}
                        />
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', fontStyle: 'italic', color: '#FFF' }}>Cadastro</Text>
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
                            mode="flat"
                            secureTextEntry
                            style={styles.input}
                        />
                        <Pressable style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 10 }} onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: '#0098E0' }}>Você já tem conta? Faça seu Login agora!</Text>
                        </Pressable>
                        <Animated.View style={{ transform: [{ scale }] }}>
                            <Button
                                mode="contained"
                                onPress={() => {
                                    animateButton();
                                    handleRegister();
                                }}
                                style={styles.button}
                            >
                                Cadastro
                            </Button>
                        </Animated.View>

                        <Pressable style={{ marginTop: 50, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('Tela Inicial')}>
                            <Text style={{ color: '#E04B00' }}>Voltar para tela inicial</Text>
                        </Pressable>

                        <View style={{ alignItems: 'center', marginTop: 40 }}>
                            <PrivacyLink />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Snackbar para exibir mensagens */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={Snackbar.DURATION_SHORT}
                action={{
                    label: 'OK',
                    onPress: () => {
                        setSnackbarVisible(false);
                    },
                }}
                style={styles.snackbar}
            >
                {snackbarMessage}
            </Snackbar>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2e2e2e',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    form: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 60,
        marginTop: 20
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
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default Register;
