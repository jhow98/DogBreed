import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Modal,
  Alert,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import Divider from 'react-native-divider';
import api from '../services/Services';
import {OPTIONS} from '../utils/utils';

const WIDTH = Dimensions.get('window').width;

import dogwalk from '../assets/dogwalk.png';

export default function Home({navigation}) {
  const [tk, setTk] = useState('');
  const [selected, setSelected] = useState('');
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  async function getToken() {
    try {
      setTk(await AsyncStorage.getItem('jwt'));
    } catch (e) {
      console.log(e);
      //In case no token is found user gets redirected to login screen
      navigation.navigate('Login');
    }
  }

  async function removeTk() {
    try {
      await AsyncStorage.removeItem('jwt');
    } catch (e) {
      // remove error
      navigation.navigate('Login');
    }
    navigation.navigate('Login');
  }

  useEffect(() => {
    getToken();
  }, []);

  function handleOverlay(item) {
    setCurrentPhoto(item);
    setModalVisible(true);
  }

  async function fetchList(breed = 'chihuahua') {
    api
      .get('/list', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: tk,
        },
        params: {
          breed: breed,
        },
      })
      .then(function(response) {
        setPhotos(response.data.list);
        setSelected(breed);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => removeTk()}>
          <Text style={styles.logoutBtn}>Sair</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/girl.jpg')}
          style={styles.userPhoto}
        />
      </View>
      <View style={styles.viewTitle}>
        <FlatList
          data={OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={styles.optionsView}>
              <TouchableOpacity onPress={() => fetchList(item.title)}>
                <View style={styles.options}>
                  <View
                    style={{
                      backgroundColor:
                        item.title === selected ? 'orange' : '#fff',
                      borderWidth: 0.7,
                      borderColor: 'lightgrey',
                      padding: 15,
                      borderRadius: 10,
                      elevation: 8,
                    }}>
                    <Icon name="dog" size={30} color="#999" />
                  </View>
                  <Text style={{color: 'grey'}}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
      {photos.length < 1 ? (
        <View style={styles.welcomeView}>
          <Text style={styles.welcomeText}>
            Seu novo melhor amigo pode estar aqui!
          </Text>
          <Image style={styles.img} source={dogwalk} />
        </View>
      ) : (
        <View style={styles.mainView}>
          <View style={styles.totalview}>
            <Divider borderColor="#ddd" color="#ccc" orientation="center">
              TOTAL: {photos.length}
            </Divider>
            <FlatList
              data={photos}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => handleOverlay(item)}>
                  <View style={styles.photoList}>
                    <View style={styles.imgView}>
                      <Image source={{uri: item}} style={styles.imgStyle} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />
          </View>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        hardwareAccelerated={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.modalView}>
          <View style={styles.modalPhoto}>
            <Image
              style={styles.photo}
              source={{
                uri: currentPhoto,
              }}
            />
            <TouchableHighlight
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Icon name="times" size={30} color="white" />
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  photoList: {
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 10,
  },

  viewTitle: {
    flex: 1,
  },

  optionsView: {
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 10,
  },

  options: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutBtn: {
    color: 'red',
    alignSelf: 'center',
    marginLeft: 15,
  },

  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },

  mainView: {
    flex: 4,
    flexDirection: 'row',
  },

  img: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },

  imgView: {
    borderRadius: 20,
    elevation: 20,
  },

  totalview: {
    flex: 1,
    marginVertical: 5,
  },

  imgStyle: {
    height: 250,
    width: 350,
    borderRadius: 20,
  },

  photo: {
    width: WIDTH - 20,
    height: 400,
  },

  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  modalPhoto: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcomeView: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeText: {
    fontFamily: 'sans-serif-thing',
    fontSize: 32,
    textAlign: 'center',
    color: '#ccc',
  },
});
