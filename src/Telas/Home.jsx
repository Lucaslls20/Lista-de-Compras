import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Alert, ActivityIndicator, Animated, Platform } from 'react-native';
import { List, Appbar, FAB, Button, Dialog, Portal, Text, PaperProvider, TextInput, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'; // Importando o DatePicker
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, deleteDoc, doc, onSnapshot, getDocs, query, where } from "firebase/firestore";
import { db, auth } from '../../services/firebaseConfig';
import { writeBatch } from "firebase/firestore";
import { Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para a data
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para exibir o DatePicker
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const fadeAnim = useState(new Animated.Value(0))[0];

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
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setNewItemTitle('');
    setSelectedDate(new Date());
  };

  const addItem = async () => {
    if (newItemTitle.trim()) {
      try {
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, 'stores'), {
            title: newItemTitle,
            completed: false,
            dateAdded: selectedDate.toISOString(), // Adicionando a data ao documento
            userId: user.uid,
          });
          setNewItemTitle('');
          hideDialog();
          showFeedback('Loja adicionada com sucesso!');
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
      showFeedback('Loja removida com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar loja e itens associados:', error);
      Alert.alert('Erro', 'Não foi possível deletar a loja e os itens. Tente novamente.');
    }
  };

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setFeedbackVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleFeedbackDismiss = () => {
    setFeedbackVisible(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Minhas Lojas" titleStyle={styles.appbarTitle} />
        </Appbar.Header>

        {loading ? (
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
                description={new Date(item.dateAdded).toLocaleDateString()} // Exibindo a data na descrição
                style={styles.listItem}
                titleStyle={styles.titleStyle}
                onPress={() => navigation.navigate('Shopping', { store: item, dateAdded: item.dateAdded })} // Passando a data para a próxima tela
                right={() => (
                  <Text
                    style={styles.delete}
                    onPress={() => deleteStoreAndItems(item.id)}
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
              />
              <Button onPress={() => setShowDatePicker(true)}>Selecionar Data</Button>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display='compact'
                  onChange={onDateChange}
                />
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancelar</Button>
              <Button onPress={addItem}>Adicionar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Snackbar
          visible={feedbackVisible}
          onDismiss={handleFeedbackDismiss}
          duration={3000}
        >
          {feedbackMessage}
        </Snackbar>
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
  },
  appbarTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 25,
  },
  listItem: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    marginTop: 24,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#656',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#A41F1B',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#03A9F4',
  },
  fabIcon: {
    fontSize: 24,
    color: '#FFF',
  },
  delete: {
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
