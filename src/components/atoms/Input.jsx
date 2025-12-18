const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full border rounded-lg px-3 py-2 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  ${className}`}
      {...props}
    />
  )
}

export default Input
