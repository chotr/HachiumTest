import Layout from "../Layout/layout"
import Today from "../Pages/today"
import Upcomming from "../Pages/upcomming"

const MainRoutes = {
  path: '/',
  element: <Layout />,
  children: [
    {
      path: '/',
      element: <Today />
    },
    {
      path: '/upcomming',
      element: <Upcomming />
    }
  ]
}

export default MainRoutes
