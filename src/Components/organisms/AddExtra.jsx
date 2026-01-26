import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import extraType from '../../api/extraType';
import extrasApi from '../../api/extrasApi';
import { useAppContext } from '../../context/AppContext';

const AddExtra = () => {
  const { user } = useAppContext();
  const [types, setTypes] = useState([]);
  const [newExtra, setNewExtra] = useState({});
    const notify = () => toast.success('Agregado');

  useEffect(() => {
    async function GetData() {
      const Resp = await extraType.getallExtraTypes();
      setTypes(Resp.data);
    }
    GetData();
    console.log(types)
  }, []);
  return <form></form>;
};

export default AddExtra;
