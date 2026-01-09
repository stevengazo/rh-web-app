const DashboardTemplate = ({ sidebar, header, content }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {sidebar}

      <div className="flex-1 flex flex-col">
        {header}
        <main className="flex-1 p-6">{content}</main>
      </div>
    </div>
  );
};

export default DashboardTemplate;
