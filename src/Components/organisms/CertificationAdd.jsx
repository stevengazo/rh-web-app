import TextInput from "../TextInput";

const CertificationAdd = () => {
  return (
    <>
      <form>
        <fieldset>
          <legend>Datos del Certificado </legend>
          <TextInput placeholder="name"></TextInput>
          <TextInput placeholder="institution"></TextInput>
        </fieldset>
      </form>
    </>
  );
};

export default CertificationAdd;
