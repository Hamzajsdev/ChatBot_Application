import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import login from '../../assets/images/login.png';

const Login = () => {
  const Navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const loginUser = () => {
    setVisible(true);
    firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(res => {
        setVisible(false);
        if (res.docs !== []) {
          console.log(JSON.stringify(res.docs[0].data()));
          goToNext(
            res.docs[0].data().names,
            res.docs[0].data().email,
            res.docs[0].data().userId,
          );
        } else {
          Alert.alert('user not found');
        }
      }) 
      .catch(error => {
        setVisible(false);
        console.log(error);
        Alert.alert('user not found');
      });
  };

  const goToNext = async (names, email, userId) => {
    await AsyncStorage.setItem('NAME', names);
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('USERID', userId);
    Navigation.navigate('MAin');
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={'purple'} barStyle={'light-content'} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.bannerHeader}>
            <Image
              source={login}
              style={{width: 70, height: 70, marginLeft: 15}}
            />
            <Text style={styles.title}>Login</Text>
          </View>
          <View style={{paddingTop: 30, }}>
            <View style={styles.cards}>
              <View style={styles.inputstyle}>
                <Text style={styles.textstyle}></Text>
                <TextInput
                  placeholder="Enter Email"
                  placeholderTextColor={'gray'}
                  style={styles.input}
                  value={email}
                  onChangeText={txt => setEmail(txt)}
                />
              </View>
              <View style={styles.inputstyle}>
                <Text style={styles.textstyle}></Text>
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor={'gray'}
                  style={styles.input}
                  value={password}
                  onChangeText={txt => setPassword(txt)}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  loginUser();
                }}>
                <View style={styles.signupBtn}>
                  <Text style={styles.btnheading}>Login</Text>
                </View>
              </TouchableOpacity>
              <Text
                style={styles.orLogin}
                onPress={() => {
                  Navigation.navigate('SignUp');
                }}>
                Or SignUp
              </Text>
              <Loader visible={visible} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cards: {
    backgroundColor: 'white',
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
    borderBottomLeftRadius: 70,
    marginBottom: 30,
    gap: 20,
    paddingTop:25
  },
  inputstyle: {
    borderWidth: 1,
    borderColor: 'purple',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textstyle: {
    backgroundColor: 'purple',
    width: 40,
    height: 48,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  bannerHeader: {
    backgroundColor: 'purple',
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  input: {
    color: 'black',
    paddingLeft: 20,
  },
  signupBtn: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
    color: 'white',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  btnheading: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  orLogin: {
    color: 'purple',
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});
