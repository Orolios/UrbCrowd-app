import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

const NewProblemScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [localization, setLocalization] = useState('');

  const handleSignUp = () => {
    Alert.alert('Sucesso');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <Text style={styles.titleLabel}>Relatar Problema</Text>
      <Text style={styles.cancelLabel}>Cancelar</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
  
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.inputDescription}
          value={description}
          onChangeText={setDescription}
          autoCapitalize='none'
        />

        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={localization}
          onChangeText={setLocalization}
          secureTextEntry
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
  },
  titleLabel: {
    fontSize: 24,
    marginTop: 10,
    padding: 20,
    color: Colors.text,
  },
  cancelLabel: {
    fontSize: 14,
    marginTop: 20,
    padding: 20,
    color: Colors.text,
  },
  image: {
    width: 56,
    height: 56,
    alignSelf: 'center',
    marginBottom: 27
  },
  inputContainer: {
    width: '100%',
    padding: 20,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 5
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderRadius: 4,
    marginBottom: 27,
    paddingHorizontal: 10,
    alignSelf: 'center'
  },
  inputDescription: {
    width: '100%',
    height: 100,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderRadius: 4,
    marginBottom: 27,
    paddingHorizontal: 10,
    alignSelf: 'center'
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    alignItems: 'center',
    width: '15%',
    marginTop: 20,
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewProblemScreen;