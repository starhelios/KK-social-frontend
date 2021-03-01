import './ConfirmedBookings.scss';
import React, { useEffect, useState } from 'react';
import {Row, Col, Radio} from 'antd'
import _get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'

import { experienceServices } from '../../services/experienceService';
import { EXPERIENCE_SET_BOOKINGS, EXPERIENCE_SET_COMPLETED_BOOKINGS } from '../../redux/types/experienceTypes';
import {
  getBookings, getCompletedBookings
} from '../../redux/selectors/experienceSelector';
import { toast } from 'react-toastify';
import { AUTH_SET_AUTHENTICATED } from '../../redux/types/authTypes';
import { useHistory } from 'react-router-dom';
import SliderConfirmed from './components/Slider/Slider';
function ConfirmedBookings() {
    const dispatch = useDispatch();
    const history = useHistory();
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
            experienceServices.getHostExperiencesById(userId).then((res) => {
                
            const { data } = res;
            const errorStatus = _get(data, 'error.status', true);
            const payload = _get(data, 'payload', null);
            console.log(payload)
                let inCompleteBookings = [];
                let completeBookings = [];
            if (!errorStatus) {
                // console.log(payload)
                payload.experiences.map((item, idx) => {

                    return moment(item.endDay).format() >= moment(new Date()).format() ? inCompleteBookings.push(item): completeBookings.push(item);
                });
                  dispatch({ type: EXPERIENCE_SET_BOOKINGS, payload: inCompleteBookings });
                  dispatch({ type: EXPERIENCE_SET_COMPLETED_BOOKINGS, payload: completeBookings });

            } else {
                console.log("couldn't go through bookings");
            }
            });
        } else {
          dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
          history.push('/');
        }


    }, [refreshComponent]);
    return (
        <div className="my-bookings">
            <Row>
                <Col md={24} sm={24} xs={24}>
                    <Row justify="center">
                        <Col>
                            <Row justify="center">
                                <h2 className="booking-title">Confirmed Bookings</h2>
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
                        showBooking === "3" ? <SliderConfirmed page={"confirmed bookings"} setRefreshComponent={setRefreshComponent} data={{data: inCompleteBookings, rows: 1, flag: showBooking, header_title:"", width: 327, height: 438, color: 1}}/> : <SliderConfirmed page={"confirmed bookings"} setRefreshComponent={setRefreshComponent} data={{data: completeBookings, rows: 1, flag: showBooking, header_title:"", width: 327, height: 438}}/>
                    }
                    
                </Col>
            </Row>
        </div>
    )
}

export default ConfirmedBookings
