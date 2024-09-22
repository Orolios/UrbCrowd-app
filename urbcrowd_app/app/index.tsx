import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro');
      return;
    }

    router.replace('/(tabs)')

  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.image}>
          <Image source={require('../assets/images/lamp-post.png')}></Image>
        </View>
        
        <Text style={styles.title}>UrbCrowd</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
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
    width: 56,
    height: 56,
    alignSelf: 'center',
    marginBottom: 27
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
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    width: '33%',
    alignSelf: 'center'
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
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