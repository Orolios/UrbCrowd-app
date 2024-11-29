import React, { useState, useEffect, useContext} from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from "expo-constants";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import {
  GoogleSignin,
  GoogleSigninButton,
  SignInResponse,
  statusCodes,
  isErrorWithCode
  } from '@react-native-google-signin/google-signin';
import { ComplaintContext } from '@/contexts/complaints';

const LoginScreen = () => {
  const { setBearer } = useContext(ComplaintContext);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = () => {

    const userData = {
      username: email,
      password: password
    };

    const hostUri = 'http://urbcrowd-dev.sa-east-1.elasticbeanstalk.com';

    fetch(hostUri + '/login', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => {
      if (!response.ok) {
        throw new Error("Não foi possível realizar seu login, verifique as credenciais e tente novamente")
      }
      return response.json();
    })
    .then(data => {
      SecureStore.setItemAsync('secure_token', data.accessToken);
      SecureStore.setItemAsync('role', data.roles[0]);
    })
    .then(() => {
      setBearer(true);
      router.replace('/(tabs)');
    })
    .catch(err => Alert.alert("Erro", err.message));
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response: SignInResponse = await GoogleSignin.signIn();
      await SecureStore.setItemAsync('secure_token', response.data?.idToken!);
      await SecureStore.setItemAsync('role', "DEFAULT");
      
      setBearer(true);
      router.replace('/(tabs)');
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Erro", "Login já está em progresso.")
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Erro", "Serviço do Google Play não disponível. Tente novamente mais tarde.")
            break;
          default:
            Alert.alert("Erro", "Tente novamente mais tarde.")
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.image}>
          <Image style={styles.logo} source={require('../assets/images/urbcrowd-logo-transparent.png')}></Image>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Usuário ou e-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          autoCapitalize='none'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={!email || !password ? {...styles.button, ...styles.disabledButton} : styles.button} 
            onPress={handleLogin}
            disabled={!email || !password}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <GoogleSigninButton style={styles.googleLogin} onPress={() => handleGoogleSignIn()}></GoogleSigninButton>

        {/* Skip Login Button
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text>Pular login</Text>
        </TouchableOpacity>*/}
      </ScrollView>

      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={styles.text}>Não tem uma conta?
            <Link style={styles.linkText} href="/NovaConta"> Registre-se</Link>
          </Text>
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    width: '100%'
  },
  image: {
    alignSelf: 'center',
    marginBottom: 27
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center"
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'normal',
    marginBottom: 45,
    textAlign: 'center',
  },
  input: {
    width: '75%',
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderRadius: 4,
    marginBottom: 27,
    paddingHorizontal: 10,
    alignSelf: 'center'
  },
  inputError: {
    color: Colors.error,
    borderWidth: 1,
    borderColor: Colors.error
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    width: '33%',
    alignSelf: 'center',
    marginBottom: 24
  },
  disabledButton: {
    opacity: 0.5
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleLogin: {
    alignSelf: 'center',
  },
  text: {
    color: Colors.text
  },
  linkText: {
    color: '#00A5CF',
    textDecorationLine: 'underline'
  },
  footerText: {
    fontSize: 12
  },
  footer: {
    alignItems: 'center'
  }
});

export default LoginScreen;