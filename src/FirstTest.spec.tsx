// import React from 'react';
import * as React from 'react';
import renderer from 'react-test-renderer';



// describe('<App />', () => {
//   it('has 1 child', () => {
//     const tree = renderer.create(<div />).toJSON();
//     expect(tree.children.length).toBe(1);
//   });
// });

export const add = (a: number, b: number) => a + b;
describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 1)).toEqual(2);
  });
});