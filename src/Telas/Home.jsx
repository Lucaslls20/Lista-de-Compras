// Home.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { List, Appbar, FAB, Button, Dialog, Portal, Text, PaperProvider,TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, deleteDoc, doc, onSnapshot, getDocs } from "firebase/firestore";
import { db } from '../../services/firebaseConfig';
import { writeBatch } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Lista de lojas
  const [visible, setVisible] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'stores'), (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(fetchedItems);
    });

    return () => unsubscribe();
  }, []);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const addItem = async () => {
    if (newItemTitle.trim()) {
      try {
        await addDoc(collection(db, 'stores'), { // Alteração para 'stores'
          title: newItemTitle,
          completed: false,
        });
        setNewItemTitle('');
        hideDialog();
      } catch (error) {
        console.error('Erro ao adicionar loja:', error);
        Alert.alert('Erro', 'Não foi possível adicionar a loja. Tente novamente.');
      }
    }
  };

  const deleteItem = async (id) => {
    try {
      const itemRef = doc(db, 'stores', id); // Alteração para 'stores'
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Erro ao deletar loja:', error);
      Alert.alert('Erro', 'Não foi possível deletar a loja. Tente novamente.');
    }
  };

  const deleteAll = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'stores')); // Alteração para 'stores'
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error('Erro ao excluir todas as lojas:', error);
      Alert.alert('Erro', 'Não foi possível excluir todas as lojas. Tente novamente.');
    }
  };

  const renderItem = ({ item }) => (
    <List.Item
      titleStyle={styles.title}
      title={item.title}
      left={() => <Text style={styles.icon}>🛒</Text>}
      right={() => (
        <Text 
          onPress={() => deleteItem(item.id)} 
          style={styles.delete}
          accessible={true}
          accessibilityLabel={`Deletar loja ${item.title}`}
        >
          🗑️
        </Text>
      )}
      onPress={() => navigation.navigate('Shopping', { store: item })} // Alteração no nome do parâmetro
      style={styles.listItem}
    />
  );

  return (
    <PaperProvider>
      <View style={{flex:1, backgroundColor:'#150BA2'}}>
        <Appbar.Header style={{ backgroundColor: '#150BA2', marginTop: 10 }}>
          <Appbar.Content title="Lista de Compras" titleStyle={{color:'#FFF'}}/>
        </Appbar.Header>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma loja adicionada ainda.</Text>
            </View>
          }
        />

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
                placeholder='Nome da loja'
                placeholderTextColor='#FFF'
                value={newItemTitle}
                onChangeText={setNewItemTitle}
                mode='outlined'
                style={styles.input}
                accessibilityLabel="Campo para digitar o nome da loja"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={addItem}>Adicionar</Button>
              <Button onPress={hideDialog}>Cancelar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={styles.deleteAllContainer}>
          <Button onPress={deleteAll}>
            <Text style={styles.deleteAllText}>Excluir tudo</Text>
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  flatList: {
    padding: 10,
    flexGrow: 1,
  },
  listItem: {
    backgroundColor: '#202453',
    marginVertical: height * 0.015,
    borderWidth: 4,
    paddingLeft: 10,
    borderRadius: 10,
    height: height * 0.1, // Altura proporcional à tela
  },
  title: {
    fontSize: height * 0.037, // Tamanho proporcional à largura da tela
    fontWeight: 'bold',
    color: '#FFF',
    fontStyle: 'italic'
  },
  icon: {
    fontSize: width * 0.06, // Tamanho proporcional à largura da tela
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  delete: {
    fontSize: width * 0.045, // Tamanho proporcional à largura da tela
    textAlign: 'center',
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#03dac6',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabIcon: {
    fontSize: width * 0.08, // Tamanho proporcional à largura da tela
    color: '#FFF',
    textAlign: 'center',
    lineHeight: width * 0.09,
  },
  input: {
    marginBottom: 15,
    color: '#FFF',
  },
  deleteAllContainer: {
    width: '70%',
    borderWidth: 3,
    marginBottom: 20,
    marginLeft: 18,
    borderRadius: 20,
    backgroundColor: '#D32F2F',
    marginRight: 10
  },
  deleteAllText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: width * 0.05,
    color: '#FFF',
    fontStyle: 'italic',
  },
});

export default Home;
