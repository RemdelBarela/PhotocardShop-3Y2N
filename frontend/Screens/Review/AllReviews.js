import React from 'react';
import { View, Text, Modal, Button } from 'react-native';

const AllReviewsModal = ({ reviews, visible, onClose }) => {
    return (
        <Modal visible={visible} animationType="slide">
            <View>
                <Text>All Reviews</Text>
                {reviews.map(review => (
                    <View key={review.id}>
                        <Text>User: {review.userName}</Text>
                        <Text>Rating: {review.rating}/5</Text>
                        <Text>Comment: {review.comment}</Text>
                    </View>
                ))}
                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
};

export default AllReviewsModal;