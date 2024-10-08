import Layout from "../Layout/layout"
import Old from "../Pages/old"
import TagContentPage from "../Pages/tag"
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
    },
    {
      path: '/tag/:id', 
      element: <TagContentPage /> 
    },
    {
      path: '/tag', 
      element: <TagContentPage /> 
    }
  ]
}

export default MainRoutes
