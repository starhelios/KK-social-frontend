import './Routes.scss';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import LoadingAnimation from './components/LoadingAnimation';

import Header from './components/Header';
import Dashboard from './layouts/Dashboard';
import MyBookings from './pages/MyBookings/MyBookings';
import MyExperiences from './pages/MyExperiences/MyExperiences';
import Profile from './pages/Profile/Profile';
import HostDetails from './pages/HostDetails/HostDetails';
import HostExperience from './pages/HostExperience/HostExperience';
import ExperiencesHostedByMe from './pages/ExperiencesHostedByMe';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import NoMatch from './pages/404/404';
import ConfirmedBookings from './pages/ConfirmedBookings/ConfirmedBookings';
import EditExperience from './pages/ExperiencesHostedByMe/pages/EditExperiences';
import Footer from './components/Revamp/ParentComponents/Footer/Footer';
import FAQ from './pages/FAQ/FAQ';
import CookiePolicy from './pages/CookiePolicy/CookiePolicy';
import CCPA from './pages/CCPA/CCPA';


const { Content } = Layout;

const ROOT = (props) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [makeUserLogin, setMakeUserLogin] = React.useState(false)
  const handleAuthChange = (value) => {
    setIsAuthenticated(value);
  };
  const callback = () => {
    setMakeUserLogin(true)
  };
  return (
    <React.Fragment>
      <Layout className='layout-wrapper'>
        <Header
        makeUserLogin={makeUserLogin}
          isAuthenticated={isAuthenticated}
          handleAuthChange={handleAuthChange}
        />
        <Content className='route-content'>
          <React.Suspense fallback={<LoadingAnimation loading={props.busy} />}>
            <Switch>
              <Route exact path='/'>
                <Dashboard callback={callback} />
                <Footer />
              </Route>
              <Route path='/booking'>
                <MyBookings />
              </Route>
              <Route path='/experience/:id'>
                <MyExperiences />
              </Route>
              <Route path='/profile'>
                <Profile />
              </Route>
              <Route path='/confirmed-bookings'>
                <ConfirmedBookings />
              </Route>
              <Route path='/hostdetails'>
                <HostDetails />
              </Route>
              <Route path='/hostexperience'>
                <HostExperience />
              </Route>
              <Route path='/experiences-hosted-by-me'>
                <ExperiencesHostedByMe />
              </Route>
              <Route render={(routeParams) =>  <EditExperience {...routeParams} />} path='/edit-experience' />
              <Route path='/privacy-policy'>
                <PrivacyPolicy />
                <Footer />
              </Route>
              <Route path='/terms-of-service'>
                <TermsOfService />
                <Footer />
              </Route>
              <Route path='/support'>
                <TermsOfService />
                <Footer />
              </Route>
              <Route path='/faq'>
                <FAQ />
                <Footer />
              </Route>
              <Route path='/cookie-policy'>
                <CookiePolicy />
                <Footer />
              </Route>
              <Route path='/ccpa'>
                <CCPA />
                <Footer />
              </Route>
              <Route path="*" component={NoMatch} />

            </Switch>
          </React.Suspense>
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default ROOT;
