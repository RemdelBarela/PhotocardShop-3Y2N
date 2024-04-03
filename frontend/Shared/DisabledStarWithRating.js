import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import DisabledStar from '../Shared/DisabledStarHome';

import baseURL from "../assets/common/baseurl";

const DisabledStarWithRating = ({ itemId }) => {
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const fetchAndCalculateRating = async () => {
        try {
            console.log('Fetching reviews for item:', itemId);
            const response = await axios.get(`${baseURL}reviews/photo/${itemId}`);
            console.log('API Response:', response.data);
            const reviews = response.data;

            let totalRating = 0;
            if (reviews.length > 0) {
                totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
                totalRating /= reviews.length;
            }

            setAverageRating(totalRating);
            setTotalReviews(reviews.length);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchAndCalculateRating();
    }, []);

    console.log('Average rating for item', itemId, 'is', averageRating);
    console.log('Total reviews for item', itemId, 'is', totalReviews);

    return (
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DisabledStar
                    maxStars={5}
                    rating={averageRating}
                    disabled={true} // Make the stars readonly
                />
                <Text style={{ marginLeft: 5, fontSize: 14, color: 'gray' }}>({averageRating.toFixed(1)})</Text>
            </View>
            <Text style={{ marginLeft: 10, fontSize: 14, color: 'gray' }}>({totalReviews}) REVIEWS</Text>
        </View>
    );
};

export default DisabledStarWithRating;
