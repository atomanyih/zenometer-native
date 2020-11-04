import {DateTime} from 'luxon';

type MoveTo = {
  command: 'M',
  x: number,
  y: number,
}

type LineTo = {
  command: 'L',
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

type ClosePath = {
  command: 'Z',
}

type PathInstruction =
  | MoveTo
  | LineTo
  | ArcTo
  | ClosePath;

const MINUTES_IN_DAY = 24 * 60

export const buildArc = (options: { radius: number; current: Date; start: Date; end: Date, bandWidth: number}): PathInstruction[] => {
  const {radius, start, end, current, bandWidth} = options;


  const startAngle = dateToAngle(current, start);
  const endAngle = dateToAngle(current, end);

  const largeArcFlag = (endAngle - startAngle) >= Math.PI;

  const innerRadius = radius - bandWidth;
  return [
    {command: 'M', x: Math.sin(startAngle) * radius, y: -Math.cos(startAngle) * radius}, // reversed bc measuring angle from vertical
    {
      command: 'A',
      rx: radius, ry: radius,
      xAxisRotation: 0,
      largeArcFlag,
      sweepFlag: true,
      x: Math.sin(endAngle) * radius, y: -Math.cos(endAngle) * radius
    },
    {
      command: 'L',
      x: Math.sin(endAngle) * innerRadius,
      y: -Math.cos(endAngle) * innerRadius
    },
    {
      command: 'A',
      rx: innerRadius, ry: innerRadius,
      xAxisRotation: 0,
      largeArcFlag,
      sweepFlag: false,
      x: Math.sin(startAngle) * innerRadius, y: -Math.cos(startAngle) * innerRadius
    },
    {command: 'Z'}
  ]
}

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const arcString = (instruction : ArcTo): string => {
  const {rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y} = instruction;

  return `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag ? 1 : 0} ${sweepFlag  ? 1 : 0} ${x} ${y}`
}

const moveString = (instruction : MoveTo): string => {
  const {x, y} = instruction;
  return `M ${x} ${y}`;
}

const lineString = (instruction : LineTo): string => {
  const {x, y} = instruction;
  return `L ${x} ${y}`;
}

export const pathInstructionsToString = (instructions: PathInstruction[]): string => {
  return instructions.map((instruction) => {
    switch (instruction.command) {
      case 'M':
        return moveString(instruction);
      case 'A':
        return arcString(instruction);
      case 'L':
        return lineString(instruction);
      case 'Z':
        return 'Z';
      default:
        return assertNever(instruction);
    }
  }).join(' ')
}

export const dateToAngle = (start: Date, end: Date): number => {
  const startDateTime = DateTime.fromJSDate(start)
  const endDateTime = DateTime.fromJSDate(end)

  return endDateTime.diff(startDateTime, 'minutes').minutes / MINUTES_IN_DAY * 2 * Math.PI;
}