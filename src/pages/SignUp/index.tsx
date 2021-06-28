import React, { useCallback, useRef } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api';



import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText
  ,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;

}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
 

  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)

  const  handleSignUp = useCallback( async (data: SignUpFormData) => { 
    try {
     formRef.current?.setErrors({});
       const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
     });
     await schema.validate(data, {
       abortEarly: false,
     });
  
     await api.post('/users', data);

     Alert.alert ('Cadastro realizado com sucesso!',
     'Você já pode fazer login na aplicação.'
     );

     navigation.goBack();
  
   }catch (err) {
     if (err instanceof Yup.ValidationError) {
      const errors = getValidationErrors(err);
  
      formRef.current?.setErrors(errors);
      return;
   }
  
   Alert.alert(  
    'Erro na no cadastro',
    'Ocorreu um erro ao realizar o cadastro, tente novamente',
   );
  }
  }, [navigation] );


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
              <Title> Crie sua conta</Title>

              <Form ref={formRef} onSubmit={handleSignUp}>
              <Input 
                returnKeyType="next"
                autoCapitalize="words" 
                name="name"
                icon="user" 
                placeholder="Nome" 
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input 
                ref={emailInputRef}
                autoCorrect={false} 
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="email-address"
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
                secureTextEntry 
                name="password"
                icon="lock"
                placeholder="Senha" 
                textContentType="newPassword" 
                returnKeyType="send" 
                blurOnSubmit={false}
              />

              <Button onPress={() => { 
                 formRef.current?.submitForm();
              }}>Cadastrar</Button>
              </Form>
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
        <BackToSignIn onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInText>Voltar para logon</BackToSignInText>
        </BackToSignIn>
      </>
  );
};

export default SignUp;