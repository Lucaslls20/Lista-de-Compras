import React, { useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, Platform, Animated } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import PrivacyLink from '../Telas/PrivacyLink';

const Login = () => {
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

    const handleLogin = async () => {
        if (validateFields()) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                navigation.navigate('Home');
            } catch (error) {
                setSnackbarMessage(`Erro ao fazer login: ${error.message}`);
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
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
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
                        <Text style={{ fontSize: 25, fontWeight: 'bold', fontStyle: 'italic', color: '#FFF' }}>Login</Text>
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
                        <Pressable style={styles.pressable} onPress={() => navigation.navigate('Registro')}>
                            <Text style={styles.pressableText}>Você não tem conta? Faça seu registro agora!</Text>
                        </Pressable>
                        <Animated.View style={{ transform: [{ scale }] }}>
                            <Button
                                mode="contained"
                                onPress={() => {
                                    animateButton();
                                    handleLogin();
                                }}
                                style={styles.button}
                            >
                                Login
                            </Button>
                        </Animated.View>

                        <Pressable style={styles.goBackPressable} onPress={() => navigation.navigate('Tela Inicial')}>
                            <Text style={styles.goBackText}>Voltar para tela inicial</Text>
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
            >
                {snackbarMessage}
            </Snackbar>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2e2e2e',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 20
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
    pressable: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    pressableText: {
        color: '#0098E0',
    },
    goBackPressable: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goBackText: {
        color: '#E04B00',
    },
});

export default Login;
