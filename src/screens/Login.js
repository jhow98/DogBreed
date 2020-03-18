import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ToastAndroid} from 'react-native';

import api from '../services/Services';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');

  function handleLogin(email) {
    if (email) {
      api
        .post('/register', {
          email,
        })
        .then(async function(response) {
          if (response.status == 200) {
            try {
              await AsyncStorage.setItem('jwt', response.data.user.token);
            } catch (e) {
              console.log(e);
            }
            navigation.navigate('Home');
          }
        })
        .catch(err =>
          ToastAndroid.show('Verique o email digitado!', ToastAndroid.LONG),
        );
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Icon name="paw" size={50} color="#999" />
      <View>
        <TextInput
          placeholder="Insira e-mail"
          style={styles.input}
          onChangeText={text => setEmail(text)}
          value={email}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.btn} onPress={() => handleLogin(email)}>
          <Text style={styles.txt}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#eee',
    height: 40,
    width: 200,
    borderColor: 'lightgrey',
    borderWidth: 0.5,
    marginVertical: 10,
    borderRadius: 4,
  },
  btn: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 4,
  },
  txt: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
