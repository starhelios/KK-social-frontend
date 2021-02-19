import './MyBookings.scss';
import React, { useEffect, useState } from 'react';
import {Row, Col, Radio} from 'antd'
import _get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';

// import SliderComponent from '../../components/SliderComponent/SliderComponent';

import image1 from "../../assets/img/booking/booking1.png";
import image2 from "../../assets/img/booking/booking2.png";
import image3 from "../../assets/img/booking/booking3.png";
import image4 from "../../assets/img/booking/booking4.png";
import image5 from "../../assets/img/booking/booking5.png";
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import { experienceServices } from '../../services/experienceService';
import { EXPERIENCE_SET_BOOKINGS, EXPERIENCE_SET_COMPLETED_BOOKINGS } from '../../redux/types/experienceTypes';
import {
  getBookings, getCompletedBookings
} from '../../redux/selectors/experienceSelector';
import { toast } from 'react-toastify';


function MyBookings() {
    const dispatch = useDispatch();
    const inCompleteBookings = useSelector((state) => getBookings(state));
    const completeBookings = useSelector((state) => getCompletedBookings(state))
    const [refreshComponent, setRefreshComponent] = useState("");
    const [showBooking, setShowBooking] = React.useState("3");

    const handleBookingChange = (e) => {
        
        setShowBooking(e.target.value);
        
    };


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log(window.location.pathname)
        if(window.location.pathname === '/booking/completion'){
            toast.success("We hope you enjoyed your experience")
        }
        console.log(userId)
        if (userId) {
            experienceServices.getUserBookings(userId).then((res) => {
                
            const { data } = res;
            const errorStatus = _get(data, 'error.status', true);
            const payload = _get(data, 'payload', null);
            console.log(payload)
                let inCompleteBookings = [];
                let completeBookings = [];
            if (!errorStatus) {
                payload.userBookings.map((item, idx) => {
                    return item.completed !== true ? inCompleteBookings.push(item): completeBookings.push(item);
                });
                  dispatch({ type: EXPERIENCE_SET_BOOKINGS, payload: inCompleteBookings });
                  dispatch({ type: EXPERIENCE_SET_COMPLETED_BOOKINGS, payload: completeBookings });

            } else {
                console.log("couldn't go through bookings");
            }
            });
        } else {
            console.log('user not logged in')
        //   dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
        //   history.push('/');
        }


    }, [refreshComponent]);
    console.log(inCompleteBookings)

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
                        showBooking === "3" ? <SliderComponent setRefreshComponent={setRefreshComponent} data={{data: inCompleteBookings, rows: 1, flag: showBooking, header_title:"", width: 327, height: 438, color: 1}}/> : <SliderComponent setRefreshComponent={setRefreshComponent} data={{data: completeBookings, rows: 1, flag: showBooking, header_title:"", width: 327, height: 438}}/>
                    }
                    
                </Col>
            </Row>
        </div>
    )
}

export default MyBookings
