import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD95lxK2qkFviVvMbFiDtSbotNjM__LJM",
  authDomain: "shopping-list-79c49.firebaseapp.com",
  databaseURL: "https://shopping-list-79c49-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopping-list-79c49",
  storageBucket: "shopping-list-79c49.appspot.com",
  messagingSenderId: "903831090024",
  appId: "1:903831090024:web:c843a00e3c5b30c4a2dcdd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    onValue(ref(database, 'items/'), (snapshot) => {
      if (snapshot.exists()) {
      const data = snapshot.val();
      const keys = Object.keys(data);
      // Combine keys with data 
      const dataWithKeys = Object.values(data).map((obj, index) => { 
        return {...obj, key: keys[index] } 
      });

      setItems(dataWithKeys);
      } else {
        setItems([]);
      }
    })
  }, []);

  const saveItem = () => {
    if (amount && product) {
      push(ref(database, 'items/'), {
        'product': product, 'amount': amount
      });
    }
    else {
      Alert.alert('Error', 'Type product and amount first');
    }
  }

  const deleteItem = (key) => {
    remove(ref(database, `items/${key}`));
  }

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='Product'
        value={product}
        onChangeText={product => setProduct(product)}
        style={{ marginTop: 30, width: 200, borderColor: 'gray', borderWidth: 1,}}
      />
      <TextInput 
        placeholder='Amount'
        value={amount}
        onChangeText={amount => setAmount(amount)}
        style={{ marginTop: 5 ,marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1,}}
      />
      <Button title='Save' onPress={saveItem} />
      <Text style={{ fontSize: 20, color: 'blue', marginTop: 30 }}>Shopping List</Text>
      <FlatList 
        style={{marginLeft: "5%"}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
        <View style={styles.listcontainer}>
          <Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
          <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.key)}>delete</Text>
        </View>}
        data={items}
      />
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
