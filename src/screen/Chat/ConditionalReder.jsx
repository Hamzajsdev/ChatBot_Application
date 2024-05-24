import {View, Text} from 'react-native';
import React, {useState} from 'react';

const ConditionalReder = () => {
  const [theme, settheme] = useState('red', 'green', 'blue', 'yellow');
  const themeColor = [];

  const data = [
    {
      name: 'Hamza',
      age: 22,
      Designation: 'Software developer',
      Qualification: 'Software Engineer',
    },
  ];

  return (
    // <View>
    //   {theme === 10  ? (
    //   <Text style={{backgroundColor:theme === 'red' ? 'green' :'blue'}}>Hello</Text>
    //   ) : (
    //     <Text style={{backgroundColor:theme === 'green' ? 'yellow' : "lightblue"}}>Not Formd</Text>
    //   )}
    // </View>
    <View>
      {data.map((item, index) => (
        <View key={index}>
          <Text style={{backgroundColor: theme === 'red' ? 'purple' : ''}}>
            {item.name}
          </Text>
          <Text style={{backgroundColor: theme === 'green' ? '' : 'red'}}>
            {item.age}
          </Text>
          <Text style={{backgroundColor: theme === 'blue' ? '' : 'gray'}}>
            {item.Designation}
          </Text>
          <Text style={{backgroundColor: theme === 'yellow' ? '' : 'pink'}}>
            {item.Qualification}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ConditionalReder;
