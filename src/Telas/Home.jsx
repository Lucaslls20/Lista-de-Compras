import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native'; // Adicione ActivityIndicator
import { List, Appbar, FAB, Button, Dialog, Portal, Text, PaperProvider, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, deleteDoc, doc, onSnapshot, getDocs, query, where } from "firebase/firestore";
import { db, auth } from '../../services/firebaseConfig';
import { writeBatch } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Novo estado para o ActivityIndicator
  const [newItemTitle, setNewItemTitle] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const storesRef = collection(db, 'stores');
      const q = query(storesRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(fetchedItems);
        setLoading(false); // Para o ActivityIndicator após o carregamento
      });

      return () => unsubscribe();
    } else {
      setLoading(false); // Se não houver usuário logado, para o ActivityIndicator
    }
  }, []);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const addItem = async () => {
    if (newItemTitle.trim()) {
      try {
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, 'stores'), {
            title: newItemTitle,
            completed: false,
            userId: user.uid,
          });
          setNewItemTitle('');
          hideDialog();
        }
      } catch (error) {
        console.error('Erro ao adicionar loja:', error);
        Alert.alert('Erro', 'Não foi possível adicionar a loja. Tente novamente.');
      }
    }
  };

  const deleteStoreAndItems = async (id) => {
    try {
      const storeRef = doc(db, 'stores', id);
      const itemsQuery = await getDocs(collection(db, 'shoppingItems'));
      const batch = writeBatch(db);

      itemsQuery.forEach((doc) => {
        if (doc.data().storeId === id) {
          batch.delete(doc.ref);
        }
      });

      batch.delete(storeRef);
      await batch.commit();

    } catch (error) {
      console.error('Erro ao deletar loja e itens associados:', error);
      Alert.alert('Erro', 'Não foi possível deletar a loja e os itens. Tente novamente.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Minhas Lojas" titleStyle={styles.appbarTitle} />
        </Appbar.Header>

        {loading ? ( // Verifica se está carregando
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#03A9F4" />
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.title}
                style={styles.listItem}
                titleStyle={styles.titleStyle}
                onPress={() => navigation.navigate('Shopping', { store: item })}
                right={() => (
                  <Text
                    style={styles.delete}
                    onPress={() => deleteStoreAndItems(item.id)}
                    accessible={true}
                    accessibilityLabel={`Deletar loja ${item.title}`}
                  >
                    🗑️
                  </Text>
                )}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>Nenhuma loja cadastrada. Adicione uma nova loja!</Text>
              </View>
            )}
          />
        )}

        <FAB
          style={styles.fab}
          icon={() => <Text style={styles.fabIcon}>+</Text>}
          onPress={showDialog}
          accessible={true}
          accessibilityLabel="Botão flutuante para adicionar uma nova loja"
        />

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Adicionar Nova Loja</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nome da Loja"
                value={newItemTitle}
                onChangeText={setNewItemTitle}
                style={styles.input}
                accessibilityLabel="Campo para adicionar o nome de uma nova loja"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog} accessibilityLabel="Cancelar adição de nova loja">Cancelar</Button>
              <Button onPress={addItem} accessibilityLabel="Confirmar adição de nova loja">Adicionar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  appbar: {
    backgroundColor: '#3E4A59',
    borderWidth: 4,
    borderRadius: 10,
    paddingLeft: 20,
  },
  appbarTitle: {
    color: '#FFF',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  listItem: {
    width: '100%',
    backgroundColor: '#F5F5DC',
    marginVertical: 4,
    marginTop: 20,
    borderRadius: 20,
  },
  titleStyle: {
    fontSize: 22,
    color: '#37474F',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyMessage: {
    fontSize: 18,
    color: '#A41F1B',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#555',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#03A9F4',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabIcon: {
    fontSize: width * 0.08,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: width * 0.09,
  },
  delete: {
    padding: 8,
    color: 'red',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
