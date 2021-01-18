import Dashboard from '../layouts/Dashboard'
import MyBookings from '../pages/MyBookings/MyBookings'
import MyExperiences from '../pages/MyExperiences/MyExperiences'
import Profile from '../pages/Profile/Profile'
import HostDetails from '../pages/HostDetails/HostDetails'
import HostExperience from '../pages/HostExperience/HostExperience'

const indexRoutes = [
    { path: '/', name: 'Home', component: Dashboard },
    { path: '/booking', name: 'Booking', component: MyBookings },
    { path: '/experience', name: 'Experience', component: MyExperiences },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/hostdetails', name: 'HostDetails', component: HostDetails },
    { path: '/hostexperience', name: 'HostExperience', component: HostExperience },
]

export default indexRoutes
