import { useState } from "react";
import ViewportList from "react-viewport-list";
import { DataType, TreeProps, NodesStateType, ChangeNodeStatusFnArgType, UpdatedParentsStatusType} from "./types";
import Node from './Node'
import Filter from "./Filter";

const CHECKBOX_STATUS = {
    unchecked: 'unchecked',
    checked: 'checked',
    indeterminate: 'indeterminate',
};

const getNodesList = (parentId: string | null, data:DataType[]): DataType[]=> {
    return data.filter((el)=> el.parentId === parentId)
}

const createNodeStatus = (nodes: DataType[], status?:string) => {
    return nodes.reduce((result, node) => {
        return {
            ...result,
            [node.id]: status? status : CHECKBOX_STATUS.unchecked
        };
    }, {});
};

const changeParentStatus = (parentId: string, id: string, status: string, nodesState:NodesStateType, data: DataType[]) => {
    //let nestedNodes: DataType[] = data.filter(node => node.parentId === parentId)
    //console.log('iteretion', parentId, id, ownParent)
    if (!data.filter(node => node.parentId === parentId).length) return
    
    let updatedParentsStatus: UpdatedParentsStatusType = {}
    let ownParent = data.find(({id}) => id === parentId)?.parentId

    
    while (parentId) {
        
        const nestedNodes: DataType[] = data.filter(node => node.parentId === parentId)
        const parentStatus = nodesState[id]
        const nestedNodesStatus: string[] = nestedNodes.map(node => {
            return  node.id === id ? status : nodesState[node.id]
        }) 
    
        if(nestedNodesStatus.every(nodeStatus => nodeStatus === parentStatus)) return
        if (nestedNodesStatus.every(nodeStatus => nodeStatus === CHECKBOX_STATUS.checked) && parentStatus !== CHECKBOX_STATUS.checked) {
            updatedParentsStatus = { ...updatedParentsStatus, [parentId]: CHECKBOX_STATUS.checked }
        } else if (nestedNodesStatus.every(nodeStatus => nodeStatus === CHECKBOX_STATUS.unchecked) && parentStatus !== CHECKBOX_STATUS.unchecked) {
            updatedParentsStatus = { ...updatedParentsStatus, [parentId]: CHECKBOX_STATUS.unchecked } 
        } else if (nestedNodesStatus.some(nodeStatus => nodeStatus !== parentStatus)) {
            updatedParentsStatus = { ...updatedParentsStatus, [parentId]: CHECKBOX_STATUS.indeterminate } 
        }

        if (!ownParent) return updatedParentsStatus
        status = updatedParentsStatus[parentId]
        id = parentId
        parentId = ownParent
        ownParent = data.find(({id}) => id === parentId)?.parentId
    }
    return updatedParentsStatus
}

const changeNestedNodesStatus = (arg: ChangeNodeStatusFnArgType) => {
    const { status, data} = arg
    let { nestedNodes } = arg

    let updatedNestedNodesStatus = {}
    
    while (nestedNodes?.length) {
        updatedNestedNodesStatus = {... updatedNestedNodesStatus, ...createNodeStatus(nestedNodes, status)}
        nestedNodes = nestedNodes?.map(({ id }) => data.filter((node) => node.parentId === id)).flat()
    }

    return updatedNestedNodesStatus
}
 
    const changeNodeStatus = (arg: ChangeNodeStatusFnArgType) => {
    const {id, status,  nestedNodes, parentId, nodesState, data, setNodesState } = arg
    const updatedParentsStatus = parentId && changeParentStatus(parentId, id, status, nodesState, data)
    const updatedNestedNodesStatus = nestedNodes && changeNestedNodesStatus(arg)
    
        if (updatedNestedNodesStatus && CHECKBOX_STATUS.indeterminate ) {
            updatedParentsStatus
            ?setNodesState({ ...nodesState, [id]: status, ...updatedNestedNodesStatus, ...updatedParentsStatus})
            : setNodesState({ ...nodesState, [id]: status, ...updatedNestedNodesStatus })
            
        }else {
            updatedParentsStatus
            ? setNodesState({ ...nodesState, [id]: status, ...updatedParentsStatus })
            : setNodesState({ ...nodesState, [id]: status})
        }
       
    }
    //  const changeSearchTermMatch = ( nodesState: NodesStateType, request: string) => 
    //        {
    //         const searchTerm = request.toLowerCase();

    //         const handledCategories: { [index: string]: number } = {};

    //         //at the beginning sets the category match status to false
    //         for (const categoryId in state) {
    //             state[categoryId].matchesSearchTerm = false;
    //         }

    //         for (const categoryId in state) {
    //             let currentCategory = state[categoryId];

    //             //checks if the current category matches the search
    //             const matches = currentCategory.name
    //                 .toLocaleLowerCase()
    //                 .includes(searchTerm);

    //             //if the current category does't match the search, moves on to the next category
    //             if (!matches) {
    //                 continue;
    //             }

    //             //checks if current category has already been handled and moves on to the next category if has been
    //             if (handledCategories[currentCategory.id]) {
    //                 continue;
    //             }

    //             //updates the current category matchesSearchTerm key to true or false depending on the validation result
    //             state[currentCategory.id].matchesSearchTerm = matches;

    //             //enters the condition while the current category has a parent
    //             while (currentCategory.parentId) {
    //                 //sets the parent as current category
    //                 currentCategory = state[currentCategory.parentId];
    //                 state[currentCategory.id].matchesSearchTerm = matches;
    //                 //adds current category to handled categories object
    //                 handledCategories[currentCategory.id] = 1;
    //             }
    //         }
    //     },



const NodesTree = ({ data }: TreeProps) => {  
    const [nodesState, setNodesState] = useState<NodesStateType>(createNodeStatus(data))
    const  [filterResult, setFilerResult] = useState<string []>([])
    const [isFilterActive, toogleFilterActiveStatus] = useState<boolean>(false)
    const rootNodes = getNodesList(null, data)
  
    const props = {
        data,
        nodesState,
        changeNodeStatus,
        changeParentStatus,
        setNodesState,
        isFilterActive
    }


     
    return (
        <>
        <Filter nodesState={nodesState} toogleFilterActiveStatus={toogleFilterActiveStatus} />
        <ul className='mr-3' >
            <ViewportList items={rootNodes} margin={8}> 
                {item => 
                        <Node node={item} {...props} key={item.id} />}
            </ViewportList>
        </ul>
        </>
    );  
};

export default NodesTree;

