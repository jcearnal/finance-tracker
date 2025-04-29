import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView }                     from 'react-native-safe-area-context';
import DateTimePicker                       from '@react-native-community/datetimepicker';
import { AuthContext }                      from '../contexts/AuthContext';
import { CategoryContext }                  from '../contexts/CategoryContext';
import { db }                               from '../utils/firebase';
import { doc, updateDoc, deleteDoc }        from 'firebase/firestore';

export default function EditTransactionScreen({ route, navigation }) {
  const { id, data } = route.params;
  const { user }     = useContext(AuthContext);
  const { categories, addCategory } = useContext(CategoryContext);

  // form fields
  const [amount, setAmount]           = useState(data.amount.toString());
  const [description, setDescription] = useState(data.description);
  const [category, setCategory]       = useState(data.category);
  const [type, setType]               = useState(data.type);
  const [date, setDate]               = useState(new Date(data.date));

  // UI state
  const [showDatePicker, setShowDatePicker]         = useState(false);
  const [showCategoryModal, setShowCategoryModal]   = useState(false);

  // new-category inline
  const [newCatName, setNewCatName] = useState('');

  // validation
  const [amountError, setAmountError]         = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    // validate amount > 0
    if (!amount) setAmountError('Required');
    else if (isNaN(amount) || parseFloat(amount) <= 0) setAmountError('Must be positive');
    else setAmountError('');
  }, [amount]);

  useEffect(() => {
    // non-empty description
    setDescriptionError(description.trim() ? '' : 'Required');
  }, [description]);

  const isValid = () => !amountError && !descriptionError && category;

  // save updates
  const handleUpdate = async () => {
    if (!isValid()) return;
    try {
      const ref = doc(db, 'users', user.uid, 'transactions', id);
      await updateDoc(ref, {
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        type,
        date: date.toISOString(),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // delete with confirmation
  const handleDelete = () => {
    Alert.alert('Delete?', 'Remove this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
            navigation.goBack();
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        }
      },
    ]);
  };

  const onChangeDate = (_, selected) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) setDate(selected);
  };

  // inline add new category
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await addCategory(newCatName.trim());
    setNewCatName('');
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setCategory(item.name);
        setShowCategoryModal(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          {amountError ? <Text style={styles.error}>{amountError}</Text> : null}

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />
          {descriptionError ? <Text style={styles.error}>{descriptionError}</Text> : null}

          {/* Category selector */}
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.selectText}>
              {category || 'Select or add category'}
            </Text>
          </TouchableOpacity>
          {/* Inline new-category */}
          <View style={styles.addCategoryRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="New category"
              value={newCatName}
              onChangeText={setNewCatName}
            />
            <Button
              title="Add"
              onPress={handleAddCategory}
              disabled={!newCatName.trim()}
            />
          </View>

          {/* Type */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.typeButtonSelected]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextSelected]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.typeButtonSelected]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextSelected]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date */}
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
              onChange={onChangeDate}
            />
          )}

          {/* Actions */}
          <View style={styles.buttonRow}>
            <Button
              title="Update"
              onPress={handleUpdate}
              disabled={!isValid()}
            />
            <View style={styles.spacer} />
            <Button
              title="Delete"
              color="red"
              onPress={handleDelete}
            />
          </View>
        </ScrollView>

        {/* Category modal */}
        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowCategoryModal(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              renderItem={renderCategoryItem}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1 },
  flex:               { flex: 1 },
  container:          { padding: 16, paddingBottom: 32 },
  label:              { marginTop: 12, fontWeight: '600' },
  input:              { height: 48, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, marginTop: 4, paddingHorizontal: 8 },
  error:              { color: 'red', marginTop: 4, fontSize: 12 },
  selectButton:       { marginTop: 4, paddingVertical: 12, paddingHorizontal: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, justifyContent: 'center' },
  selectText:         { fontSize: 16 },
  addCategoryRow:     { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  typeContainer:      { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  typeButton:         { flex: 1, paddingVertical: 12, marginHorizontal: 4, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, alignItems: 'center' },
  typeButtonSelected: { borderColor: '#2ecc71' },
  typeButtonText:     { fontSize: 16 },
  typeButtonTextSelected: { color: '#2ecc71', fontWeight: '600' },
  dateButton:         { marginTop: 4, paddingVertical: 12, paddingHorizontal: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, alignItems: 'center' },
  dateText:           { fontSize: 16 },
  buttonRow:          { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  spacer:             { width: 16 },
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent:       { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', maxHeight: '50%', borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 16 },
  modalTitle:         { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  modalItem:          { paddingVertical: 12 },
  modalItemText:      { fontSize: 16 },
});