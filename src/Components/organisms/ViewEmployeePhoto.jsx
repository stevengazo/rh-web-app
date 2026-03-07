const ViewEmployeePhoto = ({ img }) => {
  const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="flex items-center justify-center">
      <img
        src={img || defaultImage}
        alt="Foto del empleado"
        className="
          w-24 h-24 sm:w-32 sm:h-32
          object-cover
          rounded-full
          border border-gray-200
          shadow-sm
        "
      />
    </div>
  );
};

export default ViewEmployeePhoto;