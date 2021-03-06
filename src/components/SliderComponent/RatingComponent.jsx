import React, { useState, useEffect } from 'react';
import { Rate} from 'antd';
import { StarOutlined } from '@ant-design/icons';

function RatingComponent({id, callback, rated}) {
    const [rating, setRating] = useState();

    const handleRatingChange = (value) => {
        console.log(value)
        setRating(value);
    };

    useEffect(() => {
        callback(id, rating);
    }, [handleRatingChange, rating])

    console.log(rating)

    return (
        <Rate onChange={handleRatingChange} value={rated && rated > 0 ? rated: rating}  character={<StarOutlined />} />
    )
}
export default RatingComponent;