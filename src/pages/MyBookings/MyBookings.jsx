import './MyBookings.scss';
import React from 'react';
import {Row, Col, Radio} from 'antd'

import SliderComponent from '../../components/SliderComponent/SliderComponent';

import image1 from "../../assets/img/booking/booking1.png";
import image2 from "../../assets/img/booking/booking2.png";
import image3 from "../../assets/img/booking/booking3.png";
import image4 from "../../assets/img/booking/booking4.png";
import image5 from "../../assets/img/booking/booking5.png";

function MyBookings() {
    const upcoming_data = [
        {
            id: 1,
            imgLink: image1,
            title: "Chef Ramasay Cooking",
            category: "Cooking",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$150"
        },
        {
            id: 2,
            imgLink: image2,
            title: "Guitar Lessons",
            category: "Music",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$85"
        },
        {
            id: 3,
            imgLink: image3,
            title: "Sushi Making",
            category: "Sports",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$250"
        },
        {
            id: 4,
            imgLink: image4,
            title: "Understanding Ingredients",
            category: "Sports",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$30"
        },
        {
            id: 5,
            imgLink: image5,
            title: "Charcutterie",
            category: "Sports",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$84"
        },
    ];

    const completed_data = [
        {
            id: 1,
            imgLink: image5,
            title: "Chef Ramasay Cooking",
            category: "Cooking",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$150"
        },
        {
            id: 2,
            imgLink: image4,
            title: "Guitar Lessons",
            category: "Music",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$85"
        },
        {
            id: 3,
            imgLink: image3,
            title: "Sushi Making",
            category: "Sports",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$250"
        },
        {
            id: 4,
            imgLink: image2,
            title: "Understanding Ingredients",
            category: "Sports",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$30"
        },
        {
            id: 5,
            imgLink: image1,
            title: "Charcutterie",
            category: "Sports",
            
            time: "Aug 8, 2020 • 12:30pm",
            price: "$84"
        },
    ];
    
    const [showBooking, setShowBooking] = React.useState("3");

    const handleBookingChange = (e) => {
        
        setShowBooking(e.target.value);
        
    };
    
    return (
        <div className="my-bookings">
            <Row>
                <Col md={24} sm={24} xs={24}>
                    <Row justify="center">
                        <Col>
                            <Row justify="center">
                                <h2 className="booking-title">My Bookings</h2>
                            </Row>
                            <Row className="my-booking-switch-button" justify="center" align="middle">
                                <Radio.Group value={showBooking} onChange={handleBookingChange} buttonStyle="solid" size="large">
                                    <Radio.Button value={"3"}>
                                        <Row justify="center" align="middle">
                                            <Col>Upcoming</Col>
                                        </Row>
                                    </Radio.Button>
                                    <Radio.Button value={"4"}>Completed</Radio.Button>
                                </Radio.Group>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="experiences-wrapper" justify="end">
                <Col md={23} xs={23} sm={23}>
                    {
                        showBooking === "3" ? <SliderComponent data={{data: upcoming_data, rows: 1, flag: showBooking, header_title:"", width: 327, height: 438, color: 1}}/> : <SliderComponent data={{data: completed_data, rows: 1, flag: showBooking, header_title:"", width: 327, height: 438}}/>
                    }
                    
                </Col>
            </Row>
        </div>
    )
}

export default MyBookings
