// Shopping.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Checkbox, TextInput, FAB, Appbar, List, PaperProvider } from 'react-native-paper';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../../services/firebaseConfig';

const { width } = Dimensions.get('window');

export default function Shopping({ route, navigation }) {
  const { store } = route.params; // Alteração no nome do parâmetro
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const EmojiCheckbox = ({ completed, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} accessible={true} accessibilityLabel={completed ? "Desmarcar item" : "Marcar item como concluído"}>
        <Text style={{ fontSize: 24 }}>
          {completed ? '✅' : '⬜'} {/* Alterna entre os emojis de checked e unchecked */}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (store && store.id) {
      const itemsRef = collection(db, 'shoppingItems'); // Alteração para 'shoppingItems'
      const q = query(itemsRef, where('storeId', '==', store.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
      });

      return () => unsubscribe();
    }
  }, [store]);

  const addItem = async () => {
    if (newItem.trim()) {
      try {
        await addDoc(collection(db, 'shoppingItems'), { // Alteração para 'shoppingItems'
          name: newItem,
          completed: false,
          storeId: store.id, // Referência da loja
        });
        setNewItem('');
      } catch (error) {
        console.error('Erro ao adicionar item de compra:', error);
        Alert.alert('Erro', 'Não foi possível adicionar o item. Tente novamente.');
      }
    } else {
      Alert.alert('Aviso', 'Por favor, insira o nome do item.');
    }
  };

  const toggleItemCompletion = async (id, completed) => {
    try {
      const itemRef = doc(db, 'shoppingItems', id); // Alteração para 'shoppingItems'
      await updateDoc(itemRef, {
        completed: !completed,
      });
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o item. Tente novamente.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const itemRef = doc(db, 'shoppingItems', id); // Alteração para 'shoppingItems'
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      Alert.alert('Erro', 'Não foi possível deletar o item. Tente novamente.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: '#6a6e73', borderWidth: 4, borderRadius: 10, paddingLeft:20 }}>
          <Appbar.Content titleStyle={styles.appbarTitle} title={store ? store.title : 'Shopping List'} />
        </Appbar.Header>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              style={styles.listItem}
              titleStyle={[styles.titleStyle, item.completed && styles.completedTitle]}
              left={() => (
                <View style={styles.leftContainer}>
                  <EmojiCheckbox
                    completed={item.completed}
                    onPress={() => toggleItemCompletion(item.id, item.completed)}
                  />
                </View>
              )}
              right={() => (
                <Text 
                  style={styles.delete} 
                  onPress={() => deleteItem(item.id)}
                  accessible={true}
                  accessibilityLabel={`Deletar item ${item.name}`}
                >
                  🗑️
                </Text>
              )}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyMessage}>Sua lista está vazia. Adicione itens!</Text>
            </View>
          )}
        />

        <TextInput
          mode='outlined'
          label="Adicionar Item"
          value={newItem}
          onChangeText={text => setNewItem(text)}
          style={styles.input}
          accessibilityLabel="Campo para adicionar um novo item de compra"
        />

        <FAB
          style={styles.fab}
          icon={() => <Text style={styles.fabIcon}>+</Text>}
          onPress={addItem}
          accessible={true}
          accessibilityLabel="Botão flutuante para adicionar um novo item de compra"
        />

      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#37474F',
  },
  listItem: {
    width: '100%',
    backgroundColor: '#ECEFF1',
    marginVertical: 4,
    marginTop: 20,
    borderRadius: 20,
  },
  titleStyle: {
    fontSize: 22,
    color: '#37474F',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50
  },
  emptyMessage: {
    fontSize: 18,
    color: '#A41F1B',
  },
  input: {
    width: '80%',
    borderRadius: 7,
    padding:10,
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF5722',
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
  appbarTitle: {
    color: '#FFF',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
