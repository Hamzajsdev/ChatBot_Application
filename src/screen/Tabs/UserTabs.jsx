import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import logout from '../../assets/images/logout.png';

let id = '';
const UserTabs = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [mode, setMode] = useState('LIGHT');
  const isFocued = useIsFocused();
  
  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    getMode();
  }, [isFocued]);
  const getMode = async () => {
    setMode(await AsyncStorage.getItem('MODE'));
  };
  const getUsers = async () => {
    id = await AsyncStorage.getItem('USERID');
    let tempData = [];
    const email = await AsyncStorage.getItem('EMAIL');
    firestore()
      .collection('users')
      .where('email', '!=', email)
      .get()
      .then(res => {
        if (res.docs != []) {
          res.docs.map(item => {
            tempData.push(item.data());
            firestore().collection('users').doc(id).update({ status: 'online' });
          });
          
        }
        setUsers(tempData);
      });
  };
  const handleLogout = () => {
    firestore().collection('users').doc(id).update({ status: 'Offline' }).then(async()=>{
      await AsyncStorage.clear();
      navigation.navigate('Login');
    });
  };



  return (
    <View
      style={[
        styles.container,
        {backgroundColor: mode == 'LIGHT' ? 'white' : '#212121'},
      ]}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />

      <View style={styles.header}>
        <Text style={styles.title}>Users Chats</Text>
        <TouchableOpacity onPress={handleLogout}>
          <View style={{flexDirection:'row', gap:5}}>
          <Image
            source={logout}
            resizeMode="stretch"
            style={{ width: 18, height: 18 }}
          />
          <Text style={styles.logout}>LogOut</Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={[styles.userItem, {backgroundColor: 'white'}]}
              onPress={() => {
                navigation.navigate('Chating', {data: item, id: id,userName: item.names, status: typeof(item.status) =="string" ? item.status : item.status.toDate().toString()});
              }}>
              <Image
                source={require('../../assets/images/userIcon.png')}
                style={styles.userIcon}
              />
              <Text style={styles.name}>{item.names}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default UserTabs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent:'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft:16,
    paddingRight:16,
  },
  title: {
    color: 'purple',
    fontSize: 20,
    fontWeight: '600',
  },
  userItem: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: 17,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    color: 'red',
  },
  userIcon: {
    width: 40,
    height: 40,
    margin:8
  },
  name: {color: 'black', marginLeft: 20, fontSize: 20, fontWeight: '600'},
  logout:{
    fontSize:15,
    color:'purple',
    fontWeight:'600'
  }
});
