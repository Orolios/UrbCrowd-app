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
import { Link, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={require("../assets/images/lamp-post.png")} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

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

      <TouchableOpacity style={styles.button}>
        <Link href="/(tabs)">
          <Text style={styles.buttonText}>Criar Conta</Text>
        </Link>
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
