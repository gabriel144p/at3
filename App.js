import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  useEffect(() => {
    carregarTarefas();
  }, []);

  useEffect(() => {
    salvarTarefas();
  }, [tarefas]);

  const carregarTarefas = async () => {
    try {
      const tarefasSalvas = await AsyncStorage.getItem('@tarefas');
      if (tarefasSalvas) setTarefas(JSON.parse(tarefasSalvas));
    } catch (e) {
      console.error('Erro ao carregar tarefas:', e);
    }
  };

  const salvarTarefas = async () => {
    try {
      await AsyncStorage.setItem('@tarefas', JSON.stringify(tarefas));
    } catch (e) {
      console.error('Erro ao salvar tarefas:', e);
    }
  };

  const adicionarTarefa = () => {
    if (novaTarefa.trim() !== '') {
      setTarefas([...tarefas, { id: Date.now().toString(), texto: novaTarefa }]);
      setNovaTarefa('');
    }
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Tarefas</Text>
      <TextInput
        style={estilos.input}
        placeholder="Add a new task"
        value={novaTarefa}
        onChangeText={setNovaTarefa}
      />
      <TouchableOpacity style={estilos.botao} onPress={adicionarTarefa}>
        <Text style={estilos.textoBotao}>Adicionar</Text>
      </TouchableOpacity>
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={estilos.itemTarefa}>
            <Text style={estilos.textoTarefa}>{item.texto}</Text>
            <TouchableOpacity onPress={() => removerTarefa(item.id)}>
              <Text style={estilos.botaoRemover}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTarefa: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    marginBottom: 10,
  },
  textoTarefa: {
    fontSize: 16,
    color: '#333333',
  },
  botaoRemover: {
    color: '#FF0000',
    fontSize: 14,
  },
});

