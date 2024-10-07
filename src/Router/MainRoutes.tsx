import Layout from "../Layout/layout"
import Old from "../Pages/old"
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
    },
    {
      path: '/old',
      element: <Old />
    }
  ]
}

export default MainRoutes
