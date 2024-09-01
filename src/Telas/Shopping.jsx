import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Checkbox, TextInput, FAB, Appbar, List, PaperProvider } from 'react-native-paper';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from '../../services/firebaseConfig';

const { width } = Dimensions.get('window');

export default function Shopping({ route, navigation }) {
  const { item } = route.params;
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const EmojiCheckbox = ({ completed, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: 24 }}>
          {completed ? '✅' : '⬜'} {/* Alterna entre os emojis de checked e unchecked */}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'shoppingList'), (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(fetchedItems);
    });

    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    if (newItem.trim()) {
      await addDoc(collection(db, 'shoppingList'), {
        name: newItem,
        completed: false,
      });
      setNewItem('');
    }
  };

  const toggleItemCompletion = async (id, completed) => {
    const itemRef = doc(db, 'shoppingList', id);
    await updateDoc(itemRef, {
      completed: !completed,
    });
  };

  const deleteItem = async (id) => {
    const itemRef = doc(db, 'shoppingList', id);
    await deleteDoc(itemRef);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#6a6e73', borderWidth: 4, borderRadius: 10 }}>
  <Appbar.Content titleStyle={styles.appbarTitle} title={item ? item.title : 'Shopping List'} />
</Appbar.Header>


<FlatList
  data={items.filter(item => item?.name?.trim())} // Verifica se item e item.name existem e se name não é vazio
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
        <Text style={styles.delete} onPress={() => deleteItem(item.id)}>🗑️</Text>
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
          mode='flat'
          label="Digite aqui"
          value={newItem}
          onChangeText={text => setNewItem(text)}
          style={styles.input}
        />

        <FAB
          style={styles.fab}
          icon={() => <Text style={styles.fabIcon}>+</Text>}
          onPress={addItem}
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
  },
  emptyMessage: {
    fontSize: 18,
    color: 'gray',
  },
  input: {
    width: '80%',
    bottom: 0,
    borderRadius: 7,
  
    padding:2,
    color:'gray'
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
