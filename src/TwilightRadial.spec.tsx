import * as React from 'react';
import {render} from '@testing-library/react-native';

import TwilightRadial, {buildArc} from './TwilightRadial';

// describe('<TwilightRadial />', () => {
//   it('renders a path', () => {
//     const {getByTestId, debug} = render(<TwilightRadial/>);
//     debug();
//     getByTestId('arc');
//   });
// });

expect.extend({
  toBeAround(actual, expected, precision = 2) {
    const pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
    if (pass) {
      return {
        message: () => `expected ${actual} not to be around ${expected}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${actual} to be around ${expected}`,
        pass: false
      }
    }
  }
});

describe('buildArc', () => {
  describe('when current time is 12PM', () => {
    describe('when arc is 12PM to 6PM', () => {
      it('draws a quarter arc', () => {
        const radius = 1;

        expect(buildArc({
          current: new Date('December 17, 1995 12:00:00'),
          start: new Date('December 17, 1995 12:00:00'),
          end: new Date('December 17, 1995 18:00:00'),
          radius: radius
        })).toEqual([
          {command: 'M', x: 0, y: radius},
          {
            command: 'A',
            rx: radius, ry: radius,
            xAxisRotation: 0,
            largeArcFlag: false,
            sweepFlag: true,
            x: radius, y: expect.toBeAround(0, 1)
          },
        ])
      });
    });

    describe('when arc is 6AM to 6PM', () => {
      it('draws with large arc flag', () => {
        const radius = 2;
        expect(buildArc({
          current: new Date('December 17, 1995 12:00:00'),
          start: new Date('December 17, 1995 6:00:00'),
          end: new Date('December 17, 1995 18:00:00'),
          radius: radius
        })).toEqual([
          {command: 'M', x: -radius, y: expect.toBeAround(0, 1)},
          {
            command: 'A',
            rx: radius, ry: radius,
            xAxisRotation: 0,
            largeArcFlag: true,
            sweepFlag: true,
            x: radius, y: expect.toBeAround(0, 1)
          },
        ])
      });
    })
  });
});