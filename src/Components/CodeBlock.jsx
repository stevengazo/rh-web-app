const CodeBlock = ({ code }) => {
  return (
    <pre className="bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-x-auto">
      <code>{code}</code>
    </pre>
  )
}

export default CodeBlock
