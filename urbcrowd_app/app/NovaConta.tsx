import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";

import { Colors } from "@/constants/Colors";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const handleCreateAccount = () => {

    const userData = {
      name: name,
      username: username,
      email: email,
      password: password
    };

    // TODO: ADD URL API
    const loginUri = Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8080') ?? 'apiurl.com';

    fetch('http:/' + loginUri + '/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => {
      if (!response.ok) {
        if (response.status === 412) {
          throw new Error("Usuário ou e-mail já está cadastrado.");
        }
      }
      return response.json();
    })
    .then(() => router.back())
    .catch(err => Alert.alert("Erro", err.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={require("../assets/images/lamp-post.png")} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Usuário</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={!name || !username || !email || !password ? {...styles.button, ...styles.disabledButton} : styles.button}
          onPress={handleCreateAccount}
          disabled={!name || !username || !email || !password}>
          <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  image: {
    width: 56,
    height: 56,
    alignSelf: "center",
    marginBottom: 27,
  },
  inputContainer: {
    width: "75%",
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    borderWidth: 0,
    borderRadius: 4,
    marginBottom: 27,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    marginTop: 18,
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    width: "33%",
    alignSelf: "center",
  },
  disabledButton: {
    opacity: 0.5
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
