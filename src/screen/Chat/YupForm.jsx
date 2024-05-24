// import React, {useState} from 'react';
// import {
//   View,
//   TextInput,
//   Button,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import {Formik} from 'formik';
// import * as Yup from 'yup';
// import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';



// const validationSchema = Yup.object().shape({
//   forms: Yup.array()
//     .of(
//       Yup.object().shape({
//         dateTime: Yup.string().test(
//           'isDateSelected',
//           'Date and time is required',
//           function (value) {
//             return value !== 'Select Date and Time';
//           },
//         ),
//         name: Yup.string().required('Name is required'),
//         fee: Yup.number()
//           .required('Fee is required')
//           .min(0, 'Fee must be greater than or equal to 0'),
//       }),
//     )
//     .test(
//       'isTimeValid',
//       'Time in subsequent fields should be at least one hour greater than the previous field and not the same',
//       function (value) {
//         let isValid = true;
//         for (let i = 1; i < value.length; i++) {
//           const currentTime = new Date(value[i].dateTime);
//           const previousTime = new Date(value[i - 1].dateTime);
//           const diffInMilliseconds = Math.abs(currentTime - previousTime);
//           const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
//           if (diffInHours < 1 || currentTime.getTime() === previousTime.getTime()) {
//             isValid = false;
//             break;
//           }
//         }
//         return isValid;
//       },
//     ),
// }).when('forms', {
//   is: forms => forms && forms.length > 0,
//   then: Yup.object().shape({
//     'forms[0].dateTime': Yup.string().min(
//       new Date().toISOString(),
//       'Date and time should be greater than current time'
//     ),
//     'forms[].dateTime': Yup.string().min(
//       Yup.ref('forms[${i - 1}].dateTime', {
//         i: (value, context) => context.parent.forms.indexOf(context.value),
//       }),
//       'Date and time should be at least one hour greater than previous field'
//     ),
//   }),
// });


// const YupForm = () => {
//   const [dates, setDates] = useState(['', '', '']);

//   const onChange = (event, selectedDate, index) => {
//     const currentDate = selectedDate ? selectedDate.toLocaleString() : '';
//     const newDates = [...dates];
//     newDates[index] = currentDate;
//     setDates(newDates);
//   };

//   const showMode = (currentMode, index) => {
//     DateTimePickerAndroid.open({
//       value: new Date(),
//       onChange: (event, date) => onChange(event, date, index),
//       mode: currentMode,
//       is24Hour: true,
//     });
//   };

 
//   return (
//     <ScrollView>
//     <View style={styles.mainContainer}>
//       <Formik
//         initialValues={{
//           forms: [
//             {dateTime: '', name: '', fee: ''},
//             {dateTime: '', name: '', fee: ''},
//             {dateTime: '', name: '', fee: ''},
//           ],
//         }}
//         validationSchema={validationSchema}
//         onSubmit={values => console.log(values)}>
//         {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
//           <View>
//             {values.forms.map((form, index) => (
//               <View key={index}>
//                 <View style={styles.btnContent}>
//                   <TouchableOpacity onPress={() => showMode('date', index)}>
//                     <View style={styles.CustomBtn}>
//                       <Text>Select Date</Text>
//                     </View>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => showMode('time', index)}>
//                     <View style={styles.CustomBtn}>
//                       <Text>Select Time</Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//                 <TextInput
//                   style={styles.textField}
//                   placeholder={
//                     dates[index] ? dates[index] : 'Select Date and Time'
//                   }
//                   onChangeText={value =>
//                     handleChange(`forms[${index}].dateTime`)(value)
//                   }
//                   onBlur={handleBlur(`forms[${index}].dateTime`)}
//                   value={
//                     dates[index]
//                       ? dates[index].toLocaleString()
//                       : 'Select Date and Time'
//                   }
//                   editable={false}
//                 />
//                 {errors.forms && errors.forms[index] && errors.forms[index].dateTime && (
//                   <Text style={styles.error}>
//                     {errors.forms[index].dateTime}
//                   </Text>
//                 )}
//                 <TextInput
//                   style={styles.textField}
//                   placeholder="Name"
//                   onChangeText={value =>
//                     handleChange(`forms[${index}].name`)(value)
//                   }
//                   onBlur={handleBlur(`forms[${index}].name`)}
//                   value={form.name}
//                 />
//                 {errors.forms && errors.forms[index] && errors.forms[index].name && (
//                   <Text style={styles.error}>{errors.forms[index].name}</Text>
//                 )}
  
//                 <TextInput
//                   style={styles.textField}
//                   placeholder="Fee"
//                   onChangeText={value =>
//                     handleChange(`forms[${index}].fee`)(value)
//                   }
//                   onBlur={handleBlur(`forms[${index}].fee`)}
//                   value={form.fee}
//                   keyboardType="numeric"
//                 />
//                 {errors.forms && errors.forms[index] && errors.forms[index].fee && (
//                   <Text style={styles.error}>{errors.forms[index].fee}</Text>
//                 )}
//               </View>
//             ))}
//             <Button
//               onPress={handleSubmit}
//               title="Submit"
//               style={styles.btn}
//               disabled={!isValid} // Disable button if form is invalid
//             />
//           </View>
//         )}
//       </Formik>
//     </View>
//   </ScrollView>

//   );
// };

// export default YupForm;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 20,
//   },
//   error: {
//     color: 'red',
//     marginLeft: 55,
//   },
//   textField: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 10,
//     padding: 10,
//     margin: 10,
//     width: 300,
//     height: 40,
//     alignSelf: 'center',
//   },
//   btn: {
//     width: 300,
//     alignSelf: 'center',
//     marginTop: 30,
//   },
//   mainContainer: {
//     marginBottom: 30,
//   },
//   btnContent: {
//     flexDirection: 'row',
//     gap: 10,
//     alignSelf: 'center',
//     marginTop: 20,
//   },
//   CustomBtn: {
//     backgroundColor: 'lightblue',
//     width: 100,
//     height: 50,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 100,
//   },
// });



import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import send from '../../assets/images/send.png';
import userIcon from '../../assets/images/userIcon.png';
import attach from '../../assets/images/attach.png';
import mic from '../../assets/images/mic.png';
import stop from '../../assets/images/stop.png';
import arrow from '../../assets/images/arrow.png';
import dot from '../../assets/images/dots.png';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import Voice from '@react-native-voice/voice';


const Chating = () => {
  const Navigation = useNavigation();
  const [messageList, setMessageList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const route = useRoute();
  const [isRecording, setIsRecording] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const {userName} = route.params;
  const {status} = route.params;
  const [recordTimerId, setRecordTimerId] = useState(null);

  useEffect(() => {
    Navigation.setOptions({title: userName, statusShown: status});
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleSettingTextClick = () => {
    Navigation.navigate('MAin');
  };
  const handleOutsidePress = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    const unSubscriber = subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data, createdAt: item._data.createdAt};
      });
      setMessageList(allmessages);
    });
    return () => unSubscriber();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      createdAt: Date.parse(msg.createdAt),
    };

    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);
    firestore()
      .collection('chats')
      .doc('' + route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);
  }, []);
 
  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: false,
      });
      const imageUrl = await uploadImages(image);
      if (imageUrl) {
        const imageMessage = {
          _id: Math.random().toString(36).substring(7),
          image: imageUrl,
          createdAt: new Date(),
          user: {
            _id: route.params.id,
          },
        };
        onSend([imageMessage]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  const uploadImages = async image => {
    try {
      let imgName = image.path.substring(image.path.lastIndexOf('/') + 1);
      let ext = imgName.split('.').pop();
      let name = imgName.split('.')[0];
      let newName = name + Date.now() + '.' + ext;
      const storageRef = storage().ref('chatmedia/' + newName);
      await storageRef.putFile(image.path);
      const url = await storageRef.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setIsRecording(true);
      setRecordTime(0); // Reset record time when starting new recording
      // Start updating record time every second
      const timerId = setInterval(() => {
        setRecordTime(prevTime => prevTime + 1);
      }, 1000);
      // Store the timer id to clear the interval when recording stops
      setRecordTimerId(timerId);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const voicePath = await Voice.stop();
      setIsRecording(false);
      clearInterval(recordTimerId); // Clear the interval updating record time
      if (voicePath) {
        // If voicePath exists (i.e., recording was successful)
        const audioUrl = await uploadVoiceMessage(voicePath);
        if (audioUrl) {
          // Create a message object with the recorded audio
          const voiceMessageObj = {
            _id: Math.random().toString(36).substring(7),
            audio: audioUrl,
            createdAt: new Date(),
            user: {
              _id: route.params.id,
            },
          };
          // Send the message to the chat area
          onSend([voiceMessageObj]);
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleSendVoiceMessage = async () => {
    if (voiceMessage) {
      const audioUrl = await uploadVoiceMessage(voiceMessage);
      if (audioUrl) {
        const voiceMessageObj = {
          _id: Math.random().toString(36).substring(7),
          audio: audioUrl,
          createdAt: new Date(),
          user: {
            _id: route.params.id,
          },
        };
        onSend([voiceMessageObj]);
      }
    }
  };
  const uploadVoiceMessage = async audioPath => {
    try {
      const audioName = audioPath.substring(audioPath.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`chatmedia/${audioName}`);
      await storageRef.putFile(audioPath);
      const url = await storageRef.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error uploading voice message:', error);
      return null;
    }
  };
  
  const renderSend = props => {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Image source={attach} style={styles.ImgIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
          <Image source={isRecording ? stop: mic} style={styles.ImgIcon} />
        </TouchableOpacity>
        {isRecording && (
        <Text style={styles.recordingDurationText}>
          {Math.floor(recordTime / 60)
            .toString()
            .padStart(2, '0') +
            ':' +
            (recordTime % 60).toString().padStart(2, '0')}
        </Text>
      )}
        <Send
          {...props}
          containerStyle={{justifyContent: 'center', paddingRight: 16}}>
          <TouchableOpacity
           onPress={handleSendVoiceMessage}>
            <Image source={send} style={styles.ImgIcon} />
          </TouchableOpacity>
        </Send>
      </View>
    );
  };

  const playAudioMessage = async audioUrl => {
    try {
      // Play audio from URL
      await SoundPlayer.playUrl(audioUrl);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#E5E5EA',
          },
          right: {
            backgroundColor: '#2E67F8',
          },
        }}
      />
    );
  };


  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <View style={styles.chatNavbar}>
          <TouchableOpacity
            onPress={() => {
              Navigation.navigate('MAin');
            }}>
            <Image source={arrow} style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <Image
            source={userIcon}
            style={{width: 40, height: 40, marginLeft: 10}}
          />
          <View style={styles.Stickycontainer}>
            <Text style={[styles.title, styles.userName]}>{userName}</Text>
            <Text style={styles.onlineStatus}>{status}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={toggleModal}>
            <Image
              source={dot}
              resizeMode="stretch"
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleModal}>
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
              <View style={styles.innerShadow}>
                <View style={styles.popupmodel}>
                  <TouchableOpacity onPress={handleSettingTextClick}>
                    <Text
                      style={{color: 'white', fontSize: 18, fontWeight: 600}}>
                      Setting
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>

      <ImageBackground
        source={require('../../assets/images/Background.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <GiftedChat
            messages={messageList}
            onSend={messages => onSend(messages)}
            user={{
              _id: route.params.id,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            renderMessageAudio={({ currentMessage }) => (
              <TouchableOpacity onPress={() => playAudioMessage(currentMessage.audio)}>
                <Text>Play Audio</Text>
              </TouchableOpacity>
            )}
            renderMessageImage={props => (
              <View>
                <Image
                  source={{uri: props.currentMessage.image}}
                  style={{
                    width: 300,
                    height: 180,
                    borderRadius: 10,
                    margin: 10,
                  }}
                  resizeMode="stretch"
                />
              </View>
            )}
            wrapperStyle={{
              backgroundColor: 'purple',
              borderRadius: 20,
              padding: 8,
              left: {
                backgroundColor: 'white',
                marginLeft: -40,
                marginBottom: 5,
                borderRadius: 0,
                borderTopStartRadius: 16,
                borderBottomRightRadius: 16,
              },
              right: {
                backgroundColor: '#2E67F8',
                borderRadius: 0,
                borderTopStartRadius: 16,
                borderBottomRightRadius: 16,
                marginBottom: 5,
              },
            }}
            textInputStyle={{color: 'black'}}
            renderTicks={() => {
              return (
                <View style={styles.tickcontent}>
                  <Text style={{color: '#68BBE3'}}>✓</Text>
                  <Text style={{color: '#68BBE3'}}>✓</Text>
                </View>
              );
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
};


export default Chating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recordingDurationText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 5,
  },
  chatNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  buttonFooterChat: {
    position: 'absolute',
    backgroundColor: 'gray',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    top: 15,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    color: 'purple',
    fontSize: 20,
    fontWeight: '600',
  },
  innerShadow: {
    flex: 1,
    alignItems: 'flex-end',
    elevation: 5,
  },
  popupmodel: {
    backgroundColor: 'purple',
    padding: 20,
    borderRadius: 10,
    width: '30%',
    marginTop: 50,
    marginRight: 20,
  },
  buttonFooterChatImg: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 20,
    width: 20,
    right: 25,
    top: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    backgroundColor: '#fff',
    gap: 6,
    borderRadius: 10,
    padding: 8,
    marginTop: -4,
    height: 'auto',
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },

  tickcontent: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingRight: 6,
    gap: -3.5,
  },
  Stickycontainer: {
    position: 'relative',
    flexDirection: 'column',
  },
  userName: {
    position: 'absolute',
    top: -16,
    left: 0,
  },
  onlineStatus: {
    position: 'absolute',
    top: 6,
    left: 0,
    color: 'green',
    fontSize: 12,
  },
  ImgIcon: {
    width: 20,
    height: 20,
  },
});
