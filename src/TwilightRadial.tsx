import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

import {View, StyleSheet} from 'react-native';
import {DateTime} from 'luxon';

type MoveTo = {
  command: 'M',
  x: number,
  y: number,
}
type ArcTo = {
  command: 'A',
  rx: number,
  ry: number,
  xAxisRotation: number,
  largeArcFlag: boolean,
  sweepFlag: boolean,
  x: number,
  y: number,
}

type PathInstruction =
  | MoveTo
  | ArcTo;

const MINUTES_IN_DAY = 24 * 60

export const buildArc = (options: { radius: number; current: Date; start: Date; end: Date }): PathInstruction[] => {
  const {radius, start, end, current} = options;

  const startDateTime = DateTime.fromJSDate(start)
  const endDateTime = DateTime.fromJSDate(end)
  const currentDateTime = DateTime.fromJSDate(current)

  const startAngle = startDateTime.diff(currentDateTime, 'minutes').minutes / MINUTES_IN_DAY * 2 * Math.PI;
  const endAngle = endDateTime.diff(currentDateTime, 'minutes').minutes / MINUTES_IN_DAY * 2 * Math.PI;
  
  return [
    {command: 'M', x: Math.sin(startAngle) * radius, y: Math.cos(startAngle) * radius}, // reversed bc measuring angle from vertical
    {
      command: 'A',
      rx: radius, ry: radius,
      xAxisRotation: 0, largeArcFlag: false, sweepFlag: true,
      x: Math.sin(endAngle) * radius, y: Math.cos(endAngle) * radius
    }
  ]
}

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