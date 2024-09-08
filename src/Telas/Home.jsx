import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Alert, ActivityIndicator, Animated, Platform } from 'react-native';
import { List, Appbar, FAB, Button, Dialog, Portal, Text, PaperProvider, TextInput, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [removingItem, setRemovingItem] = useState(null); // Para rastrear o item sendo removido

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const storesRef = collection(db, 'stores');
      const q = query(storesRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fadeAnim: new Animated.Value(0), // Animação individual para cada item
          slideAnim: new Animated.Value(0), // Animação de remoção
        }));
        setData(fetchedItems);
        setLoading(false);

        // Iniciar a animação para cada item quando os dados forem carregados
        fetchedItems.forEach((item, index) => {
          Animated.timing(item.fadeAnim, {
            toValue: 1,
            duration: 800,
            delay: index * 100, // Delay para cada item
            easing: Easing.ease,
            useNativeDriver: true,
          }).start();
        });
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
            dateAdded: selectedDate.toISOString(),
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

  const deleteStoreAndItems = (item) => {
    Animated.timing(item.slideAnim, {
      toValue: 1, // Deslizar para a direita
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(async () => {
      try {
        const storeRef = doc(db, 'stores', item.id);
        const itemsQuery = await getDocs(collection(db, 'shoppingItems'));
        const batch = writeBatch(db);

        itemsQuery.forEach((doc) => {
          if (doc.data().storeId === item.id) {
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
    });
  };

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setFeedbackVisible(true);
  };

  const handleFeedbackDismiss = () => {
    setFeedbackVisible(false);
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
              <Animated.View
                style={[
                  styles.animatedItem,
                  {
                    opacity: item.fadeAnim,
                    transform: [
                      {
                        translateX: item.slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, width], // Deslizar para fora da tela
                        }),
                      },
                    ],
                  },
                ]}
              >
                <List.Item
                  title={item.title}
                  description={`${new Date(item.dateAdded).toLocaleDateString()} - ${item.address || 'Sem endereço'}`}
                  style={styles.listItem}
                  titleStyle={styles.titleStyle}
                  onPress={() => navigation.navigate('Shopping', { store: item, dateAdded: item.dateAdded })}
                  right={() => (
                    <Text
                      style={styles.delete}
                      onPress={() => deleteStoreAndItems(item)}
                    >
                      🗑️
                    </Text>
                  )}
                />
              </Animated.View>
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
            <Dialog.Actions style={{justifyContent:'space-between'}}>
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
    backgroundColor: '#e2e2e2',
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
  animatedItem: {
    opacity: 0,
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
    fontSize: 18,
    color: '#999',
  },
  delete: {
    color: '#E74C3C',
    fontSize: 22,
    marginRight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#03A9F4',
  },
  fabIcon: {
    fontSize: width * 0.08,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: width * 0.09,
  },
  input: {
    marginBottom: 10,
  },
});

export default Home;
