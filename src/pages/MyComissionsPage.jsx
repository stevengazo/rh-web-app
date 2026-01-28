import SectionTitle from '../Components/SectionTitle';
import comissionsApi from '../api/comissionsApi';
import ComissionTable from '../Components/organisms/ComissionTable';

import { useAppContext } from '../context/AppContext';

import { useEffect, useState } from 'react';

import Divider from '../Components/Divider';

const MyCommissionsPage = () => {
  const { user } = useAppContext();
  const [comission, setComission] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await comissionsApi.getComissionsByUser(user.id);
        setComission(res.data);
      } catch (err) {
        console.error('Error comissions', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SectionTitle>Comisiones</SectionTitle>
      <Divider />
      <ComissionTable comissions={comission} />
    </>
  );
};

export default MyCommissionsPage;
