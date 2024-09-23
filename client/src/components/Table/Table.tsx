interface TableProps {
  headers: string[];
  elements: {
    title: string;
    status: string;
    passedCases: string;
    detailButton: React.ReactNode;
  }[];
}

const Table: React.FC<TableProps> = ({ headers, elements }) => {
  return (
    <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg shadow-md">
      <thead>
        <tr className="bg-gray-700 border-b border-gray-600">
          {headers.map((header, index) => (
            <th key={index} className="py-3 px-4 text-left">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {elements.map((element, index) => (
          <tr key={index} className="hover:bg-gray-700">
            <td className="py-3 px-4">{element.title}</td>
            <td className={`py-3 px-4 ${element.status === "Passed" ? "text-green-400" : "text-red-400"}`}>
              {element.status}
            </td>
            <td className={`py-3 px-4 ${element.status === "Passed" ? "text-green-400" : "text-red-400"}`}>
              {element.passedCases}
            </td>
            <td className="py-3 px-4">
              {element.detailButton}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;