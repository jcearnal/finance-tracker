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
import { SafeAreaView }               from 'react-native-safe-area-context';
import DateTimePicker                 from '@react-native-community/datetimepicker';
import { AuthContext }                from '../contexts/AuthContext';
import { CategoryContext }            from '../contexts/CategoryContext';
import { db }                         from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddTransactionScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { categories, addCategory } = useContext(CategoryContext);

  const [amount, setAmount]         = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory]     = useState(categories[0]?.name || '');
  const [type, setType]             = useState('expense');
  const [date, setDate]             = useState(new Date());

  const [showDatePicker, setShowDatePicker]     = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [amountError, setAmountError]         = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [newCatName, setNewCatName]           = useState('');

  // Validate amount & description
  useEffect(() => {
    setAmountError(!amount
      ? 'Required'
      : isNaN(amount) || parseFloat(amount) <= 0
        ? 'Enter a positive number'
        : ''
    );
  }, [amount]);

  useEffect(() => {
    setDescriptionError(!description.trim() ? 'Required' : '');
  }, [description]);

  const isValid = () => !amountError && !descriptionError && category;

  const handleSubmit = async () => {
    if (!isValid()) return;
    try {
      const col = collection(db, 'users', user.uid, 'transactions');
      await addDoc(col, {
        amount:    parseFloat(amount),
        description: description.trim(),
        category,
        type,
        date:      date.toISOString(),
        createdAt: serverTimestamp(),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const onChangeDate = (_, selected) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) setDate(selected);
  };

  // Add a brand-new category inline
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await addCategory(newCatName);
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
            placeholder="e.g. 12.50"
            value={amount}
            onChangeText={setAmount}
          />
          {amountError ? <Text style={styles.error}>{amountError}</Text> : null}

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Groceries"
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

          {/* Inline “add new category” */}
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

          {/* Type selector (unchanged) */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonSelected
              ]}
              onPress={() => setType('expense')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextSelected
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonSelected
              ]}
              onPress={() => setType('income')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextSelected
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date picker (unchanged) */}
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

          {/* Save */}
          <View style={styles.submit}>
            <Button
              title="Save Transaction"
              onPress={handleSubmit}
              disabled={!isValid()}
              color={isValid() ? undefined : '#ccc'}
            />
          </View>
        </ScrollView>

        {/* Category Modal */}
        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowCategoryModal(false)}
          />
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
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
  selectButton: {
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 16,
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginVertical: 12,
  },
  typeContainer: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:      4,
  },
  typeButton: {
    flex:           1,
    paddingVertical:12,
    marginHorizontal:4,
    borderColor:    '#ccc',
    borderWidth:    1,
    borderRadius:   4,
    alignItems:     'center',
  },
  typeButtonSelected: {
    borderColor: '#2ecc71',
  },
  typeButtonText: {
    fontSize:16,
  },
  typeButtonTextSelected: {
    color:     '#2ecc71',
    fontWeight:'600',
  },
  dateButton: {
    marginTop:      4,
    paddingVertical:12,
    paddingHorizontal:8,
    borderColor:    '#ccc',
    borderWidth:    1,
    borderRadius:   4,
    alignItems:     'center',
  },
  dateText: {
    fontSize:16,
  },
  submit: {
    marginTop:24,
  },
  modalOverlay: {
    flex:           1,
    backgroundColor:'rgba(0,0,0,0.3)',
  },
  modalContent: {
    position:         'absolute',
    bottom:           0,
    left:             0,
    right:            0,
    backgroundColor:  '#fff',
    maxHeight:        '50%',
    borderTopLeftRadius:12,
    borderTopRightRadius:12,
    padding:16,
  },
  modalTitle: {
    fontSize:    18,
    fontWeight: '600',
    marginBottom:12,
  },
  modalItem: {
    paddingVertical:12,
  },
  modalItemText: {
    fontSize:16,
  },
});