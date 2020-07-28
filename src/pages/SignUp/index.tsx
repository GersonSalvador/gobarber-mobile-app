import React, {useCallback, useRef} from 'react';
import {Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';
// import logoImg from '../../assets/logo.png';
import getValidationErrors from '../../util/getValidationErrors';
import api from '../../services/api';

import { Container, Title, BackToSignin, BackToSigninText } from './styles';

interface SignUpFormData{
  email: string;
  password: string;
  name: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  
  //To fire the submmit function
  const formRef = useRef<FormHandles>(null)

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Required Name'),
          email: Yup.string()
            .required('Required E-mail')
            .email('Enter a valid email'),
          password: Yup.string().min(12, '12 characters length minimum'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        navigation.goBack();
        
      } catch (err) {
        console.log(err);

        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        Alert.alert('Oh no!', "We cound't create your account. Plase try again later.");
      }
    },[navigation],
  );

  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)

  return (
    <>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding': undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={require('../../assets/logo.png')} />
            {/* View to animate the Title component correctly */}
            <View>
              <Title>Create Your Account</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Name"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"

                // Some possible values:
                //   newPassword: generates a new password
                //   oneTimeCode: get a code reading SMS
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>Create Account</Button>
            </Form>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignin onPress={()=> navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff"/>
        <BackToSigninText>
          Go Back
        </BackToSigninText>
      </BackToSignin>
    </>
  )
}

export default SignUp;