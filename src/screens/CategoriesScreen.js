import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { CategoryContext } from '../contexts/CategoryContext';

export default function CategoriesScreen() {
  const { categories, addCategory, updateCategory, deleteCategory } = useContext(CategoryContext);

  const [newCat, setNewCat]         = useState('');
  const [editingId, setEditingId]   = useState(null);
  const [editingName, setEditingName] = useState('');

  // Add a new category
  const handleAdd = () => {
    if (!newCat.trim()) return;
    addCategory(newCat);
    setNewCat('');
  };

  // Save edits to an existing category
  const handleSaveEdit = (id) => {
    if (!editingName.trim()) return;
    updateCategory(id, editingName);
    setEditingId(null);
    setEditingName('');
  };

  // Confirm before deleting
  const confirmDelete = (id) => {
    Alert.alert(
      'Delete category?',
      'This will remove the category permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteCategory(id) 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Categories</Text>

        {/* Add new category row */}
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="New category"
            value={newCat}
            onChangeText={setNewCat}
          />
          <Button
            title="Add"
            onPress={handleAdd}
            disabled={!newCat.trim()}
          />
        </View>

        {/* List of categories */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              {editingId === item.id ? (
                // Inline edit mode
                <>
                  <TextInput
                    style={[styles.input, styles.editInput]}
                    value={editingName}
                    onChangeText={setEditingName}
                  />
                  <Button
                    title="Save"
                    onPress={() => handleSaveEdit(item.id)}
                    disabled={!editingName.trim()}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => setEditingId(null)}
                  />
                </>
              ) : (
                // Display mode
                <>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingId(item.id);
                      setEditingName(item.name);
                    }}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize:     20,
    fontWeight:   '600',
    marginBottom: 12,
    textAlign:    'center',
  },
  addRow: {
    flexDirection:   'row',
    alignItems:      'center',
    marginBottom:    16,
  },
  input: {
    flex:             1,
    height:           40,
    borderColor:      '#ccc',
    borderWidth:      1,
    borderRadius:     4,
    paddingHorizontal:8,
    marginRight:      8,
  },
  editInput: {
    marginRight: 4,
  },
  itemRow: {
    flexDirection:   'row',
    alignItems:      'center',
    marginBottom:    12,
  },
  itemText: {
    flex:          1,
    fontSize:      16,
  },
  editText: {
    color:       '#007AFF',
    marginRight: 12,
  },
  deleteText: {
    color: 'red',
  },
});