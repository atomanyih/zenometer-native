import * as React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';


const App = () => (<Text>hello</Text>);

describe('<App />', () => {
  it('has 1 child', () => {
    const {getByText} = render(<App/>);
    getByText(/hello/i);
  });
});
