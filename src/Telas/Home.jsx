import React, { useState } from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { List, Appbar, FAB, Button, Dialog, Portal, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // FlatList começa vazia
  const [visible, setVisible] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const addItem = () => {
    setData([...data, { id: Math.random().toString(), title: newItemTitle }]);
    setNewItemTitle('');
    hideDialog();
  };

  const deleteItem = (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
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
        >
          🗑️
        </Text>
      )}
      onPress={() => {}}
      style={styles.listItem}
    />
  );

 const deleteAll = () => {
  setData([])
 }

  return (
    <View style={{ flex: 1, backgroundColor: '#755AD9' }}>
      <Appbar.Header style={{ backgroundColor: '#755AD9', marginTop:10 }}>
        <Appbar.Content title="Lista de Compras" />
      </Appbar.Header>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatList}
        ListEmptyComponent={<List.Item title="Nenhuma Loja adicionada ainda." />}
      />

      <FAB
        style={styles.fab}
        icon={() => <Text style={styles.fabIcon}>+</Text>}
        onPress={showDialog}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Adicionar Novo Item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder='Nome da loja'
              value={newItemTitle}
              onChangeText={setNewItemTitle}
              mode='outline'
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={addItem}>Adicionar</Button>
            <Button onPress={hideDialog}>Cancelar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={{width:'70%', borderWidth:3, marginBottom:20, marginLeft:10, borderRadius:20, backgroundColor:'#D32F2F'}}>
      <Button onPress={deleteAll}>
        <Text style={{fontSize:18, fontWeight:'bold'}}>Excluir tudo</Text>
      </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {
    padding: 10,
  },
  listItem: {
    backgroundColor: '#FFF59D',
    marginVertical: 5,
    borderWidth: 3,
    paddingLeft: 5,
    borderRadius: 10,
    height: 70,
    top:0
  },
  title: {
    fontSize: 24, // Defina o tamanho da fonte que você deseja
    fontWeight: 'bold', // Isso é opcional, se você quiser o texto em negrito
    color: '#000', // Defina a cor do texto
    fontStyle:'italic'
  },
  icon: {
    fontSize: 20,
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  delete: {
    fontSize: 18,
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
    backgroundColor: '#D32F2F',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // Adiciona sombra para dar um efeito flutuante
  },
  fabIcon: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 28, // Alinha verticalmente o texto dentro do FAB
  },
  input: {
    marginBottom: 15,
    color: '#000',
  },
});

export default Home;
