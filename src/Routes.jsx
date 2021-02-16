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

const { Content } = Layout;

const ROOT = (props) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const handleAuthChange = (value) => {
    setIsAuthenticated(value);
  };
  return (
    <React.Fragment>
      <Layout className='layout-wrapper'>
        <Header
          isAuthenticated={isAuthenticated}
          handleAuthChange={handleAuthChange}
        />
        <Content className='route-content'>
          <React.Suspense fallback={<LoadingAnimation loading={props.busy} />}>
            <Switch>
              {/* {indexRoutes.map((prop, key) => {
                  if (prop.name === 'Home') {
                    return <Route to={prop.path} component={prop.component} key={key} />
                  } else return <Route exact path={prop.path} component={prop.component} key={key} />
                })} */}
              <Route exact path='/'>
                <Dashboard />
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
              <Route path='/hostdetails/:id'>
                <HostDetails />
              </Route>
              <Route path='/hostexperience'>
                <HostExperience />
              </Route>
              <Route path='/experiences-hosted-by-me'>
                <ExperiencesHostedByMe />
              </Route>
              <Route path='/privacy-policy'>
                <PrivacyPolicy />
              </Route>
              <Route path='/terms-of-service'>
                <TermsOfService />
              </Route>
              <Route path='/support'>
                <TermsOfService />
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
