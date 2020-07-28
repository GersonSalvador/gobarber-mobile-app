import React from 'react';
import {RectButtonProperties} from 'react-native-gesture-handler'

import {Container, ButtonText} from './styles';

interface ButtonPros extends RectButtonProperties{
  children: string;
}

const Button: React.FC<ButtonPros> = ({children, ...rest}) => (
  <Container {...rest}>
    <ButtonText>
      {children}
    </ButtonText>
  </Container>
)
export default Button;