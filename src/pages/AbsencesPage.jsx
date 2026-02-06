import absencesApi from '../api/absencesApi';
import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import AbsenceTable from '../Components/organisms/AbsenceTable';
import { useEffect, useState } from 'react';
import AbsenceCalendar from '../Components/organisms/AbsenceCalendar';
const AbsencesPage = () => {
    const [absences, setAbsences] = useState()
  
    useEffect( ()=>{
        const GetData = async()=>{

        }
        GetData()
    },[])

    return (
    <>
      <div className="d-flex flex flex-row justify-between p-1">
        <PageTitle>Ausencias</PageTitle>
        <PrimaryButton>Agregar Registro</PrimaryButton>
      </div>
    </>
  );
};

export default AbsencesPage;
