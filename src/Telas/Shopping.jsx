import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Checkbox, TextInput, FAB, Appbar, List, PaperProvider } from 'react-native-paper';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, where, getDoc } from "firebase/firestore";
import { db, auth } from '../../services/firebaseConfig';

const { width } = Dimensions.get('window');

export default function Shopping({ route, navigation }) {
  const { store } = route.params;
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  const EmojiCheckbox = ({ completed, onPress }) => (
    <TouchableOpacity style={{ marginLeft: 10 }} onPress={onPress} accessible={true} accessibilityLabel={completed ? "Desmarcar item" : "Marcar item como concluído"}>
      <Text style={{ fontSize: 24 }}>
        {completed ? '✅' : '⬜'}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(
        collection(db, 'shoppingItems'),
        where('storeId', '==', store.id),
        where('userId', '==', user.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(fetchedItems);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [store.id]);

  const addItem = async () => {
    if (newItem.trim()) {
      try {
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, 'shoppingItems'), {
            title: newItem,
            completed: false,
            storeId: store.id,
            userId: user.uid,
          });
          setNewItem('');
        }
      } catch (error) {
        console.error('Erro ao adicionar item de compra:', error);
        Alert.alert('Erro', 'Não foi possível adicionar o item. Tente novamente.');
      }
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const itemRef = doc(db, 'shoppingItems', id);
      await updateDoc(itemRef, { completed: !completed });
    } catch (error) {
      console.error('Erro ao atualizar item de compra:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o item. Tente novamente.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const user = auth.currentUser;
      const itemRef = doc(db, 'shoppingItems', id);
      const itemDoc = await getDoc(itemRef);
      if (itemDoc.exists() && itemDoc.data().userId === user.uid) {
        await deleteDoc(itemRef);
      } else {
        Alert.alert('Erro', 'Você não tem permissão para deletar este item.');
      }
    } catch (error) {
      console.error('Erro ao deletar item de compra:', error);
      Alert.alert('Erro', 'Não foi possível deletar o item. Tente novamente.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content titleStyle={styles.appbarTitle} title={store ? store.title : 'Shopping List'} />
        </Appbar.Header>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#03A9F4" />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.title}
                style={styles.listItem}
                titleStyle={[styles.titleStyle, item.completed && styles.completedTitle]}
                left={() => (
                  <EmojiCheckbox
                    completed={item.completed}
                    onPress={() => toggleComplete(item.id, item.completed)}
                  />
                )}
                right={() => (
                  <Text 
                    style={styles.delete} 
                    onPress={() => deleteItem(item.id)}
                    accessible={true}
                    accessibilityLabel={`Deletar item ${item.title}`}
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
        )}

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
  completedTitle: {
    textDecorationLine: 'line-through',
    color: 'gray',
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
    width: '80%',
    borderRadius: 7,
    padding: 9,
    marginTop: 20,
    backgroundColor: '#3E4A59',
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
