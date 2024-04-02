import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const StarRating = ({ rating, disabled }) => {
  const [selectedRating, setSelectedRating] = useState(rating);

  // Update selectedRating when rating changes
  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const handleRatingPress = (newRating) => {
    if (!disabled) {
      setSelectedRating(newRating);
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleRatingPress(index)}
          style={styles.starButton}
          disabled={disabled} // Disable TouchableOpacity if component is disabled
        >
          <Icon
            name={selectedRating >= index ? "star" : "star-o"}
            size={30}
            color="black"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starButton: {
    marginHorizontal: 5,
  },
});

export default StarRating;
