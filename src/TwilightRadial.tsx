import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

import {View, StyleSheet} from 'react-native';

const TwilightRadial = () => {
  return (
    <View
      testID={"whattt"}
      style={[
        StyleSheet.absoluteFill,
        {alignItems: 'center', justifyContent: 'center'},
      ]}
    >
      <Svg viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="blue"
          strokeWidth="2.5"
          fill="green"
        />
        <Path
          d="M 0 0
           A 50 50 0 0 1 50 50
           L 40 50
           A 40 40 0 0 0 0 10" stroke="black" fill="green" stroke-width="1" fill-opacity="0.5"/>
      </Svg>
    </View>
  )
};

export default TwilightRadial;