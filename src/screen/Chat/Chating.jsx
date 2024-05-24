import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import userIcon from '../../assets/images/userIcon.png';
import attach from '../../assets/images/attach.png';
import send from '../../assets/images/send.png';
import mic from '../../assets/images/mic.png';
import stop from '../../assets/images/stop.png';
import play from '../../assets/images/play.png';
import pause from '../../assets/images/pouse.png';
import arrow from '../../assets/images/arrow.png';
import dot from '../../assets/images/dots.png';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';

const Chating = () => {
  const {width} = useWindowDimensions();
  const route = useRoute();
  const Navigation = useNavigation();
  const [messageList, setMessageList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const {status} = route.params;
  const {userName} = route.params;
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioPath, setAudioPath] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

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
    setMessageList(previousMessages => [myMsg, ...previousMessages]);
    await firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);
    await firestore()
      .collection('chats')
      .doc(route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);
  }, [route.params.data.userId, route.params.id]);
  

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
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}>
          <Image source={isRecording ? stop : mic} style={styles.ImgIcon} />
        </TouchableOpacity>
        {isRecording && (
          <Text style={{alignSelf: 'center', color: 'red'}}>
            {formatDuration(recordingDuration)}
          </Text>
        )}
        <Send
          {...props}
          containerStyle={{justifyContent: 'center', paddingRight: 16}}>
          <Image source={send} style={styles.ImgIcon} />
        </Send>
      </View>
    );
  };

  // ------------------------Voice Recording Section----------------------

  useEffect(() => {
    requestAudioPermission();
  }, []);

  const requestAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Recording Permission',
          message: 'App needs access to your microphone to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Recording permission granted');
      } else {
        console.log('Recording permission denied');
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error);
    }
  };

  const togglePlayPause = async audioFile => {
    if (audioPath === audioFile && isPlayingCurrent) {
      stopAudio();
      setIsPlayingCurrent(false);
    } else {
      if (isPlayingCurrent) {
        stopAudio();
      }
      await playAudio(audioFile);
      setIsPlayingCurrent(true);
      setAudioPath(audioFile);
    }
  };

  const stopAudio = () => {
    if (sound) {
      sound.stop(() => {
        sound.release();
        setSound(null);
      });
      setIsPlayingCurrent(false);
    }
  };
  
  useEffect(() => {
    if (isPlayingCurrent) {
      pauseAudio();
      setIsPlaying(false);
    }
  }, [isPlayingCurrent]);

  useEffect(() => {
    let timerId;
    if (isRecording) {
      timerId = setInterval(() => {
        setRecordingDuration(prevDuration => prevDuration + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => clearInterval(timerId);
  }, [isRecording]);

  useEffect(() => {
    AudioRecord.init({});
  }, []);

  const startRecording = async () => {
    try {
      if (!isRecording) {
        const options = {
          sampleRate: 16000,
          channels: 1,
          bitsPerSample: 16,
          audioSource: 6,
          wavFile: 'chat_voice_record.wav',
        };
        const filePath = await AudioRecord.start(options);
        setIsRecording(true);
        setAudioPath(filePath);
      }
    } catch (error) {}
  };

  const stopRecording = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        const audioFile = await AudioRecord.stop();
        setAudioPath(audioFile);
        const audioUrl = await uploadAudioToFirebase(audioFile);
        storeAudioInfoInFirestore(audioUrl, recordingDuration);
        const audioMessage = {
          audio: audioUrl,
          duration: recordingDuration,
          createdAt: new Date().toISOString(),
          user: {
            _id: route.params.id,
          },
        };
  
        handleSend([audioMessage]);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
  
  const storeAudioInfoInFirestore = async (audioUrl, duration) => {
    const db = firestore();
    try {
      await db.collection('audio').add({
        url: audioUrl,
        duration: duration,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log('Audio info stored in Firestore.');
    } catch (error) {
      console.error('Error storing audio info:', error);
      throw error;
    }
  };

  const handleSend = async (newMessages = []) => {
    if (newMessages.length > 0) {
      try {
        const batch = firestore().batch();
        newMessages.forEach(msg => {
          const messageId = firestore().collection('chats').doc().id;
          const createdAt = new Date(); 
          const senderMessageRef = firestore()
            .collection('chats')
            .doc(`${route.params.id}${route.params.data.userId}`)
            .collection('messages')
            .doc(messageId);
          const recipientMessageRef = firestore()
            .collection('chats')
            .doc(`${route.params.data.userId}${route.params.id}`)
            .collection('messages')
            .doc(messageId);
          batch.set(senderMessageRef, {
            ...msg,
            _id: messageId,
            createdAt: createdAt.toISOString(),
          });
          batch.set(recipientMessageRef, {
            ...msg,
            _id: messageId,
            createdAt: createdAt.toISOString(),
          });
        });
  
        await batch.commit();
        console.log('Messages sent successfully');
      } catch (error) {
        console.error('Error sending messages: ', error);
      }
    }
  };
  
  const pauseAudio = () => {
    if (sound) {
      sound.pause();
    }
  };

  const renderAudio = ({ currentMessage }) => {
    if (currentMessage.audio) {
      const isCurrentUser = currentMessage.user._id === route.params.id;
      const isCurrentlyPlaying = audioPath === currentMessage.audio && isPlayingCurrent;
      return (
        <View
          style={[
            styles.audioPlayContent,
            { alignSelf: isCurrentUser ? 'flex-start' : 'flex-end' },
          ]}
        >
          <View style={[styles.recordVoice, { width: width / 1.15 }]}>
            <TouchableOpacity onPress={() => togglePlayPause(currentMessage.audio)}>
              <Image
                source={isCurrentlyPlaying ? pause : play}
                style={styles.iconAudio}
              />
            </TouchableOpacity>
            <View style={[styles.playContent, { width: width / 1.4 }]}>
              <Text style={styles.recordText}>
                {isCurrentlyPlaying ? 'Pause Audio' : 'Play Audio'}
              </Text>
              <Text style={styles.durationText}>
                {formatDuration(currentMessage.duration)}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return null;
  };
  
  const playAudio = async (audioFile) => {
    const newSound = new Sound(audioFile, '', (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
      newSound.play((success) => {
        if (!success) {
          console.error('Audio playback failed due to an audio decoding error');
        }
        setIsPlayingCurrent(false);
        setAudioPath(null);
      });
    });
    setSound(newSound);
  };
  

  const formatDuration = durationInSeconds => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  const uploadAudioToFirebase = async audioPath => {
    const storageRef = storage().ref();
    const audioRef = storageRef.child(`audio/${Date.now()}.mp3`);

    try {
      await audioRef.putFile(audioPath);
      console.log('Audio uploaded successfully.');
      return audioRef.getDownloadURL();
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
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
            onSend={handleSend}
            user={{
              _id: route.params.id,
            }}
            renderMessageAudio={renderAudio}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
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
  sentVoiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E67F8',
    borderRadius: 20,
    padding: 10,
  },
  receivedVoiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    padding: 10,
  },
  playIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  audioDuration: {
    marginRight: 10,
    color: 'white',
  },

  // ---------------------Voice Audio CSS--------------------------

  recordVoice: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    paddingLeft: 15,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  recordText: {
    color: 'black',
    fontSize: 16,
  },
  audioPlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconAudio: {
    width: 18,
    height: 18,
  },
  durationText: {
    color: 'black',
  },
  playContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
