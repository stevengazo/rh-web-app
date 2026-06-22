import CodeBlock from './CodeBlock';

const ExampleBlock = ({ title, children, code }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-ink-secondary">{title}</h4>

      <div className="p-4 border border-stroke-soft rounded-xl bg-canvas">
        {children}
      </div>

      <CodeBlock code={code} />
    </div>
  );
};

export default ExampleBlock;
