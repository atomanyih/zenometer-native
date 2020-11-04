import * as React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import { Dimensions } from 'react-native';

import {View, StyleSheet, Text} from 'react-native';
import {buildArc, pathInstructionsToString} from "./Paths";

const styles = StyleSheet.create({
  svg: {
    borderWidth: 4,
    borderColor: "#20232a",
  }
});

const { width, height } = Dimensions.get('screen');

const TwilightRadial = () => {
  const d = pathInstructionsToString(buildArc({
    radius: 50,
    current: new Date('December 17, 1995 12:00:00'),
    start: new Date('December 17, 1995 12:00:00'),
    end: new Date('December 17, 1995 18:00:00'),
  }));

  return (
    <View
      testID={"whattt"}
      style={[
        StyleSheet.absoluteFill,
      ]}
    >
      <Svg viewBox="-100 -100 200 200" style={styles.svg} width={width} height={height}>
        <Path d="M -1 0 L 1 0" stroke="black" ></Path>
        <Path d="M 0 -1 L 0 1" stroke="black" ></Path>
        <Path
          d={d} stroke="black" fill="green" stroke-width="1" fill-opacity="0.5"/>
      </Svg>
      <Text>{d}</Text>

    </View>
  )
};

export default TwilightRadial;