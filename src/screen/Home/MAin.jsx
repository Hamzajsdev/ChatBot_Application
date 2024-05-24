import {View, StyleSheet, TouchableOpacity, Image, StatusBar} from 'react-native';
import React, {useState} from 'react';
import user from '../../assets/fonts/users.png'
import setting from '../../assets/images/setting.png';
import Setting from '../Tabs/Setting';
import UserTabs from '../Tabs/UserTabs';

const MAin = () => {
  const [selected, setSelected] = useState(0);
  return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'}/>
        {selected == 0 ? <UserTabs/> : <Setting/>}
      <View style={styles.bottomtabs}>
        <TouchableOpacity
          style={styles.tabs}
          onPress={() => {
            setSelected(0);
          }}>
          <Image
            source={user}
            resizeMode="stretch"
            style={[
              styles.tabsIcon,
              {tintColor: selected == 0 ? 'white' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabs}
          onPress={() => {
            setSelected(1);
          }}>
          <Image
            source={setting}
            resizeMode="stretch"
            style={[
              styles.tabsIcons,
              {tintColor: selected == 1 ? 'white' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MAin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomtabs: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: 'purple',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsIcon: {
    width: 35,
    height: 35,
  },
  tabsIcons: {
    width: 35,
    height: 35,
  },
});
