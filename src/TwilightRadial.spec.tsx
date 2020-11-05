import * as React from 'react';
import {render} from '@testing-library/react-native';

import TwilightRadial from './TwilightRadial';

describe('<TwilightRadial />', () => {
  it('renders a path', () => {
    const {getByTestId, debug} = render(<TwilightRadial/>);
  });
});
