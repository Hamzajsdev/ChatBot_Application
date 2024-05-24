import { View, Text, Modal, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React from 'react'

const Loader = ({visible}) => {
  return (
    <Modal visible={visible} transparent>
        <View style={styles.modalview}>
            <View style={styles.mainview}>
                <ActivityIndicator size={'large'}/>
            </View>
        </View>
    </Modal>
  )
}

export default Loader

const styles=StyleSheet.create({
    modalview:{
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
       backgroundColor:'rgba(0,0,0,0.6)',
       justifyContent:'center',
       alignItems:'center'
    },
    mainview:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
        backgroundColor:'#fff'
    }
})