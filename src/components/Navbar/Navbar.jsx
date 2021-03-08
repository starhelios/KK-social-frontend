import './Navbar.scss';
import React, { useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { useGoogleLogout } from 'react-google-login';
import { Col, Row, Avatar, Button, Menu, Grid, Dropdown, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { MenuOutlined } from '@ant-design/icons';
import _get from 'lodash/get';

import avatar_img from '../../assets/img/avatar.jpg';
import { authServices } from '../../services/authServices';
import { AUTH_SET_AUTHENTICATED } from '../../redux/types/authTypes';
import { getUserInfo } from '../../redux/selectors/authSelector';

const { useBreakpoint } = Grid;

function Navbar(props) {
  const { location, history, isHost } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userInfoSelector = useSelector((state) => getUserInfo(state));

  const onLogoutSuccess = (res) => { };

  const onFailure = () => { };
  const { signOut, loaded } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    onLogoutSuccess,
    onFailure,
  });

  const hostedMe = location.pathname.includes('experiences-hosted-by-me');

  const color =
    (location.pathname.includes('experience') ||
      location.pathname.includes('host')) &&
      !hostedMe
      ? 'black'
      : '';

  const handleLogout = () => {
    authServices
      .logout({ refreshToken: localStorage.getItem('refresh_token') })
      .then((res) => {
        console.log(res);
      });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('userId');
    localStorage.removeItem('setFirstPass');

    signOut();
    dispatch({ type: AUTH_SET_AUTHENTICATED, payload: false });
    history.push('/');
  };
  const { sm } = useBreakpoint() - 1;

  const avatarUrl = _get(userInfoSelector, 'avatarUrl', '');

  useEffect(() => {
    if (userInfoSelector) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [userInfoSelector]);

  return (
    <Col md={24} sm={24} xs={24}>
      <Row justify='end' className='loged-in-nav-bar'>
        <Menu mode={'horizontal'}>
          {isHost && (
            <Menu.Item>
              <NavLink exact to='/hostexperience' style={{ color: color }}>
                Host an Experience
              </NavLink>
            </Menu.Item>
          )}



          <Menu.Item>
            <NavLink exact to='/booking' style={{ color: color }}>
              My Bookings
            </NavLink>
          </Menu.Item>
        </Menu>
        <Col
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <Dropdown
            overlay={
              <Menu mode={'horizontal'}>
                <Menu.Item>
                  <NavLink exact to='/profile'>
                    Profile
                  </NavLink>
                </Menu.Item>
                <Menu.Item>
                  <div onClick={() => handleLogout()}>Log Out</div>
                </Menu.Item>
              </Menu>
            }
            overlayClassName='nav-profile-dropdown'
            trigger={['click']}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {loading && (
                <Skeleton.Avatar
                  active={loading}
                  size={39.6}
                  shape='circle'
                  style={{ display: 'flex' }}
                />
              )}
              {!loading && (
                <Avatar size={39.6} src={avatarUrl ? avatarUrl : avatar_img} />
              )}
            </div>
          </Dropdown>
        </Col>
      </Row>
      <Row justify='end' align='middle'>
        {/* <Button className="barsMenu" type="primary" onClick={handleShowDrawer}><MenuOutlined /></Button> */}
        <Dropdown
          overlay={
            !sm ? (
              <Menu mode={'inline'}>
                <Menu.Item key='experience'>
                  <NavLink exact to='/hostexperience'>
                    Host an Experience
                  </NavLink>
                </Menu.Item>
                <Menu.Item key='booking'>
                  <NavLink exact to='/booking'>
                    My Bookings
                  </NavLink>
                </Menu.Item>
                <Menu.Item key='profile'>
                  <NavLink exact to='/profile'>
                    Profile
                  </NavLink>
                </Menu.Item>
                <Menu.Item key='logout'>
                  <div onClick={() => handleLogout()}>Log Out</div>
                </Menu.Item>
              </Menu>
            ) : (
                <Menu mode={'inline'}>
                  <Menu.Item key='profile'>
                    <NavLink exact to='/profile'>
                      Profile
                  </NavLink>
                  </Menu.Item>
                  <Menu.Item key='logout'>
                    <div onClick={() => handleLogout()}>Log Out</div>
                  </Menu.Item>
                </Menu>
              )
          }
          trigger={['click']}
        >
          <Button
            className='barsMenu'
            type='primary'
            style={{ background: color, borderColor: color }}
          >
            <MenuOutlined />
          </Button>
        </Dropdown>
      </Row>
    </Col>
  );
}

export default withRouter(Navbar);
