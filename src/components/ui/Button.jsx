function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      className={`rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button