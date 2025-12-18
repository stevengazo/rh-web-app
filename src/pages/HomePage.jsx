import DashboardTemplate from "../components/templates/DashboardTemplate"
import Sidebar from "../components/organisms/Sidebar"
import Header from "../components/organisms/Header"

const HomePage = () => {
  return (
    <DashboardTemplate
      sidebar={<Sidebar />}
      header={<Header />}
      content={
        <>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido al Sistema de Recursos Humanos
          </p>
        </>
      }
    />
  )
}

export default HomePage
