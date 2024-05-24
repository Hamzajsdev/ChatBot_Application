import {View, Text, StyleSheet, Image} from 'react-native';
import React, { useState } from 'react'

const InChatFileTransfer = ({ filePath, fileType }) => {
  const [imagedata, setImagedata]=useState()
    var fileType = '';
    var name = '';
    if (filePath !== undefined) {
      name = filePath.split('/').pop();
      fileType= filePath.split('.').pop();
    }
  return (
    <View style={styles.container}>
    <View
      style={styles.frame}
    >
       <Image
          source={
            fileType === 'pdf'
              ? require('../../assets/images/chatfile.jpg')
              : { uri: filePath }
          }
          resizeMode='cover'
          style={{height: 160, width: 240}}
        />
      <View>
        <Text style={styles.textType}>{fileType.toLowerCase()}</Text>
      </View>
    </View>
  </View>
  )
}

export default InChatFileTransfer 

const styles = StyleSheet.create({
    container: {
    //   flex: 1,
      marginTop: 5,
      borderRadius: 15,
      padding: 5,
    },
    text: {
      color: 'black',
      marginTop: 10,
      fontSize: 16,
      lineHeight: 20,
      marginLeft: 5,
      marginRight: 5,
    },
    textType: {
      color: 'black',
      marginTop: 5,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    frame: {
      backgroundColor: '#fff',
      gap:6,
      borderRadius: 10,
      padding: 8,
      marginTop: -4,
      height:'auto'
    },
  });