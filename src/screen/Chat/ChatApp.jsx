import { View, Text, StyleSheet, StatusBar, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ChatApp = () => {
    const Navigation=useNavigation()
    useEffect(() =>{
        setTimeout(()=>{
            CheckLogin()
        },2000)
    },[]);
    const CheckLogin=async()=>{
        const id =await AsyncStorage.getItem('USERID');
        if(id !== null){
            Navigation.navigate('MAin');
        }
        else{
            Navigation.navigate('Login')
        }
    }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'purple'} barStyle={'light-content'} />
      <Text style={styles.heading}>ChatBot Application</Text>
    </View>
  )
}

export default ChatApp

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'purple',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    heading:{
        color:'white',
        fontSize:30,
        fontWeight: 'bold'
    }

})