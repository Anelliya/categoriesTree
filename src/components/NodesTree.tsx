import { useEffect, useState } from "react";
import { VariableSizeList as List } from 'react-window';

//import Node from "./Node"

import { useSelector } from "react-redux";

import data from "../categories.json";

type NodeType = { name: string, id: string, children: NodeType[]}
type NodesType = NodeType[]


// function NodesTree(): JSX.Element {

//   const [nodes, setNodes] = useState<NodesType>([]);
//   //const nodesData = useSelectorr<RootState>(state => console.log('state', state))
  
//    const dataNodes = data.map((node) => ({ ...node, checked: 'unchecked' }))
  
  
//   useEffect(() => {
//     if (dataNodes?.length > 0) {
//       setNodes(dataNodes)
//     }
//   },[])
 
//   return (
//     <>
//      <ul>
//         {nodes?.length > 0 && nodes.map((node) => <Node {...node}  />)}
//       </ul>
//   </>
  
//   );
// }


//export default NodesTree