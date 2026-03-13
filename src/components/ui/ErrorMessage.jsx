function ErrorMessage({ message = 'Something went wrong.' }) {
  return <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>
}

export default ErrorMessage