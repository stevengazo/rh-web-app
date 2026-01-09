import CodeBlock from './CodeBlock';

const ExampleBlock = ({ title, children, code }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-600">{title}</h4>

      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        {children}
      </div>

      <CodeBlock code={code} />
    </div>
  );
};

export default ExampleBlock;
