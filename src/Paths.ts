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

  const largeArcFlag = (endAngle - startAngle) >= Math.PI;

  return [
    {command: 'M', x: Math.sin(startAngle) * radius, y: Math.cos(startAngle) * radius}, // reversed bc measuring angle from vertical
    {
      command: 'A',
      rx: radius, ry: radius,
      xAxisRotation: 0,
      largeArcFlag,
      sweepFlag: true,
      x: Math.sin(endAngle) * radius, y: Math.cos(endAngle) * radius
    }
  ]
}