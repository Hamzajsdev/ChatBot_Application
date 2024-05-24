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
import uuid from 'react-native-uuid';
import signup from '../../assets/images/signup.png';

const SignUp = () => {
  const Navigation = useNavigation();
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setphone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const registerUser = () => {
    const userId = uuid.v4();
    firestore()
      .collection('users')
      .doc(userId)
      .set({
        names: names,
        email: email,
        password: password,
        phone: phone,
        userId: userId,
      })
      .then(res => {
        console.log('user Created successfully');
        Navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });
  };
  const validate = () => {
    let isValid = true;
    if (names == '') {
      isValid = false;
    }
    if (email == '') {
      isValid = false;
    }
    if (phone == '') {
      isValid = false;
    }
    if (password == '') {
      isValid = false;
    }
    if (confirmPassword == '') {
      isValid = false;
    }
    if (confirmPassword !== password) {
      isValid = false;
    }
    return isValid;
  };
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={'purple'} barStyle={'light-content'} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.bannerHeader}>
            <Image source={signup} style={{width: 70, height: 70}} />
            <Text style={styles.title}>Sign Up</Text>
          </View>
          <View style={styles.cards}>
            <View style={{paddingTop: 25, gap: 20}}>
              <View
                style={styles.inputstyle}>
                <Text style={styles.textstyle}></Text>
                <TextInput
                  placeholder="Enter name"
                  placeholderTextColor={'gray'}
                  style={styles.input}
                  value={names}
                  onChangeText={txt => setNames(txt)}
                />
              </View>
              <View
                style={styles.inputstyle}>
                <Text
                  style={styles.textstyle}></Text>
              <TextInput
                placeholder="Enter Email"
                placeholderTextColor={'gray'}
                style={styles.input}
                value={email}
                onChangeText={txt => setEmail(txt)}
              />
              </View>
              <View
                style={styles.inputstyle}>
                <Text
                  style={styles.textstyle}></Text>
              <TextInput
                placeholder="Enter phone"
                placeholderTextColor={'gray'}
                style={styles.input}
                keyboardType={'number-pad'}
                value={phone}
                onChangeText={txt => setphone(txt)}
              />
              </View>
              <View
                style={styles.inputstyle}>
                <Text
                  style={styles.textstyle}></Text>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor={'gray'}
                style={styles.input}
                value={password}
                onChangeText={txt => setPassword(txt)}
              />
              </View>
              <View
                style={styles.inputstyle}>
                <Text
                  style={styles.textstyle}></Text>
              <TextInput
                placeholder="Enter Confirm password"
                placeholderTextColor={'gray'}
                style={styles.input}
                value={confirmPassword}
                onChangeText={txt => setConfirmPassword(txt)}
              />
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (validate()) {
                    registerUser();
                  } else {
                    Alert.alert('Please correct data');
                  }
                }}>
                <View style={styles.signupBtn}>
                  <Text style={styles.btnheading}>SignUp</Text>
                </View>
              </TouchableOpacity>
              <Text
                style={styles.orLogin}
                onPress={() => {
                  Navigation.goBack();
                }}>
                Or Login
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  cards: {
    backgroundColor: 'white',
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
    borderBottomLeftRadius: 70,
    marginTop: 30,
    marginBottom: 30,
  },
  inputstyle:{
    borderWidth: 1,
    borderColor: 'purple',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textstyle:{
    backgroundColor: 'purple',
    width: 40,
    height: 48,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  input: {
    paddingLeft: 20,
    color:'black'
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
