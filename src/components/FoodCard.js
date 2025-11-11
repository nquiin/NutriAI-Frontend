// file: frontend/src/components/FoodCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoodCard = ({ food }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{food.name}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detail}>Calories: {Math.round(food.calories)}</Text>
        <Text style={styles.detail}>Protein: {food.protein.toFixed(1)}g</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detail}>Fat: {food.fat.toFixed(1)}g</Text>
        <Text style={styles.detail}>Carbs: {food.carbs.toFixed(1)}g</Text>
      </View>
      {food.is_vegetarian && <Text style={styles.vegetarian}>✓ Món chay</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  vegetarian: {
    marginTop: 5,
    color: 'green',
    fontWeight: 'bold',
  },
});

export default FoodCard;