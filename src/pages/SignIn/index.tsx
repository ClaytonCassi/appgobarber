import React, {useCallback, useRef} from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View, TextInput, Alert } from 'react-native';
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/Auth';
import getValidationErrors from '../../utils/getValidationErrors'

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
  ,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;

}

const SignIn: React.FC = () => {
const navigation = useNavigation();
const {SignIn} = useAuth();


const formRef = useRef<FormHandles>();
const passwordInputRef = useRef<TextInput>();

const  handleSignIn = useCallback( async (data: SignInFormData) => { 
  try {
   formRef.current?.setErrors({});
   const schema = Yup.object().shape({
     email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
     password: Yup.string().required('Senha obrigatória'),
   })
   await schema.validate(data, {
     abortEarly: false,
   });

  await SignIn({
     email : data.email,
     password : data.password
   });

 }catch (err) {
   if (err instanceof Yup.ValidationError) {
    const errors = getValidationErrors(err);

    formRef.current?.setErrors(errors);
    return;
 }

 Alert.alert(  
  'Erro na autenticacao',
  'Ocorreu um erro ao realizar o login, cheque as credenciais',
 );
}
}, [SignIn] );

  return (
    <>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled
        >
          <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flex: 1}}
          >
            <Container>
              <Image source={logoImg} />
              <View>
                <Title> Faça seu logon</Title>
              </View>
              <Form  ref={formRef} onSubmit={handleSignIn}>
                <Input autoCorrect={false}
                  autoCapitalize="none" //evitando caixa alta no inicio do texto 
                  keyboardType="email-address"
                  returnKeyType="next"
                  name="email" 
                  icon="mail" 
                  placeholder="E-mail"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                  }}
                />
              <Input 
                  ref={passwordInputRef}
                  name="password"
                  icon="lock" 
                  placeholder="Senha"
                  returnKeyType="send"
                  secureTextEntry
                  onSubmitEditing={() => {
                    formRef.current?.submitForm();
                  }}
               />
              <Button onPress={() => {
                formRef.current?.submitForm();
               }}>Entrar</Button>
              </Form>
              <ForgotPassword>
                <ForgotPasswordText onPress={() => { }}>Esqueci minha senha</ForgotPasswordText>
              </ForgotPassword>
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
        <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar um conta</CreateAccountButtonText>
        </CreateAccountButton>
      </>
  );
};

export default SignIn;