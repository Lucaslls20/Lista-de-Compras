import React from 'react';
import { View } from 'react-native';
import Inicial from './Initial';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login/Login';
import Register from './Login/Registro';
import Home from './Telas/Home';
import { PaperProvider } from 'react-native-paper';

const App = () => {

    const Stack = createStackNavigator();

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerTransparent: true, // Faz o header ser transparente
                        headerTitleAlign: 'center', // Centraliza o título do header
                        headerTitleStyle: {
                            color: '#FFF', // Define a cor do texto no header
                            fontSize: 18, // Tamanho do texto
                            fontWeight: 'bold', // Peso do texto
                        },
                    }}
                >
                    <Stack.Screen name='Tela Inicial' component={Inicial} />
                    <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name='Registro' component={Register} options={{ headerShown: false }} />
                    <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                {/*   <Stack.Screen name='Detalhes' component={Detalhes} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );

}
{/*const Detalhes = ({ route }) => {
    const { itemId } = route.params;

    return (
        <View>
            <Text>Detalhes do item {itemId}</Text>
        </View>
    );
};
*/}

export default App;