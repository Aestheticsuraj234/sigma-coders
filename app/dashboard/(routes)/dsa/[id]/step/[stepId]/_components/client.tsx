import { ProblemColumn, columns } from "./columns";
import { DataTable } from "@/components/Global/data-table";

interface ProblemClientProps {
  data: ProblemColumn[];
};

export const DsaProblemClient: React.FC<ProblemClientProps> = ({
  data
}) => {

  return (
    <> 
      <DataTable searchKey="problemTitle" columns={columns} data={data} />    
    </>
  );
};
