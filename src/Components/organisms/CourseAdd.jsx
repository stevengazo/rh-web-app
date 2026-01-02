import TextInput from "../TextInput";

const CourseAdd = () => {
  return (
    <>
      <form>
        <fieldset>
          <legend>Datos del Curso</legend>
          <TextInput placeholder="name"></TextInput>
          <TextInput placeholder="institution"></TextInput>
        </fieldset>

        <fieldset>
          <legend>Descripcion</legend>
          <TextInput placeholder="description"></TextInput>
        </fieldset>
      </form>
    </>
  );
};

export default CourseAdd;
