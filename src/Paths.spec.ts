import {buildArc, pathInstructionsToString} from "./Paths";

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
          {command: 'M', x: 0, y: -radius},
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

describe('pathInstructionsToString', () => {
  it('concats empty', () => {
    expect(pathInstructionsToString([])).toEqual('');
  });

  it('concats instructions', () => {
    expect(pathInstructionsToString([
      {command: 'M', x: 1, y: 2},
      {command: 'A', rx: 3, ry: 4, xAxisRotation: 10, largeArcFlag: false, sweepFlag:true,  x: 5, y: 6}
    ])).toEqual('M 1 2 A 3 4 10 0 1 5 6');
  });
});