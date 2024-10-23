import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

import ListItem from "@/components/Listagem";
interface Item {
  id: string;
  nome: string;
  endereco: string;
  tipo: string;
  status: string;
  nota: number;
}

// Exemplo de dados para preencher a lista
const item : Item = 
    {
      id: "1",
      nome: "Buraco na rua",
      endereco: "Rua A, 123",
      tipo: "asfalto",
      status: "Ativo",
      nota: 4.8,
    }
  ;

const InformationScreen = () => {

  


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <Text style={styles.titleLabel}>Relatar Problema</Text>
      </View>


      <View style={styles.infoContainer}>
      <Text style={styles.nameLabel}>{item.nome}</Text>
      <Text style={styles.label}>Relatado em:</Text>
      </View>

      <Text style={styles.titleLabel}>Detalhes</Text>
      <View style={styles.infoContainer}>
      <Text style={styles.label}>{item.tipo}</Text>
      <Text style={styles.label}>{item.nota}</Text>
      </View>
      <Text style={styles.titleLabel}>Localizacao</Text>
      <View style={styles.infoContainer}>

      <Text style={styles.label}>{item.endereco}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
  },
  titleLabel: {
    fontSize: 24,
    padding: 10,
    color: Colors.text,
  },
  nameLabel: {
    fontSize: 24,
    color: 'black',
  },
  cancelLabel: {
    fontSize: 14,
    marginTop: 20,
    padding: 20,
    color: 'black',
  },
  image: {
    width: 56,
    height: 56,
    alignSelf: 'center',
    marginBottom: 27
  },
  infoContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 20
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    
  },
  label: {
    fontSize: 14,
    color: 'black',

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

export default InformationScreen;