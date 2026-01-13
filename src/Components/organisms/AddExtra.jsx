import { useEffect, useState } from 'react';
import extraType from '../../api/extraType';
import extrasApi from '../../api/extrasApi';
import { useAppContext } from '../../context/AppContext';

const AddExtra = () => {
  const { user } = useAppContext();
  const [types, setTypes] = useState([]);
  const [newExtra, setNewExtra] = useState({});

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
