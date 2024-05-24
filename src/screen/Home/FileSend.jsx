import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import send from '../../assets/images/send.png';
import attach from '../../assets/images/attach.png';
import * as DocumentPicker from 'react-native-document-picker';
import InChatFileTransfer from './InChatFileTransfer ';
import InChatViewFile from './InChatViewFile';

const FileSend = () => {
  interface File extends IMessage {
    url?: string;
  }
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
  const [fileVisible, setFileVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: 'Welcome !',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'UserChat',
        avatar: '',
      },
      image: '',
      file: '',
    },
  ]);

  
  const onSend = useCallback((messages = []) => {
    const [messageToSend] = messages;
    if (isAttachImage) {
      const newMessage = {
        _id: messages[0]._id + 1,
        text: messageToSend.text,
        createdAt: new Date(),
        user: {
          _id: 2,
          avatar: '',
        },
        image: imagePath,
        file: {
          url: ''
        }
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessage),
      );
      setImagePath('');
      setIsAttachImage(false);
    } else if (isAttachFile) {
      const newMessage = {
        _id: messages[0]._id + 1,
        text: messageToSend.text,
        createdAt: new Date(),
        user: {
          _id: 2,
          avatar: '',
        },
        image: '',
        file: {
          url: filePath
        }
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessage),
      );
      setFilePath('');
      setIsAttachFile(false);
    } else {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    }
  },
  [filePath, imagePath, isAttachFile, isAttachImage],
  );

  const renderSend = props => {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={_pickDocument}>
          <Image source={attach} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        <Send
          {...props}
          containerStyle={{justifyContent: 'center', paddingRight: 16}}>
          <View>
            <Image source={send} style={{width: 20, height: 20}} />
          </View>
        </Send>
      </View>
    );
  };

  const renderBubble = (props) => {
    const {currentMessage} = props;
    if (currentMessage.file && currentMessage.file.url) {
      return (
        <TouchableOpacity
        style={{
          ...styles.fileContainer,
          backgroundColor: props.currentMessage.user._id === 2 ? '#2e64e5' : '#efefef',
          borderBottomLeftRadius: props.currentMessage.user._id === 2 ? 15 : 5,
          borderBottomRightRadius: props.currentMessage.user._id === 2 ? 5 : 15,
        }}
        onPress={() => setFileVisible(true)}
        >
          <InChatFileTransfer
            style={{marginTop: -10}}
            filePath={currentMessage.file.url}
          />
          <InChatViewFile
              props={props}
              visible={fileVisible}
              onClose={() => setFileVisible(false)}
            />
          <View style={{flexDirection: 'column'}}>
            <Text style={{
                  ...styles.fileText,
                  color: currentMessage.user._id === 2 ? 'white' : 'black',
                }} >
              {currentMessage.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#efefef',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
        setImagePath(fileUri);
        setIsAttachImage(true);
      } else {
        setFilePath(fileUri);
        setIsAttachFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };

  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View>
          <Image source={{uri: imagePath}} style={{height: 75, width: 75}} />
          <TouchableOpacity
            onPress={() => setImagePath('')}
            // style={styles.buttonFooterChatImg}
          >
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (filePath) {
      return (
        <View>
          <InChatFileTransfer filePath={filePath} />
          <TouchableOpacity
            onPress={() => setFilePath('')}
            // style={styles.buttonFooterChat}
          >
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath]);

  return (
    <View style={{flex: 1}}>
      {/* <NavBar /> */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 2,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderChatFooter={renderChatFooter}
      />
    </View>
  );
};

export default FileSend;
