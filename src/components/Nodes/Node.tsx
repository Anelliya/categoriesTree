import { useEffect, useState, useRef } from 'react';
import {DataType, NodePropsType, ExtendTreeFnType} from './types'


//render nested nodes tree
 const extendTreeByNestedNodes = ({nodes, data, nodesState, changeNodeStatus, setNodesState, isFilterActive}: ExtendTreeFnType) => {
    if (nodes) {
        const props = {data, nodesState, changeNodeStatus, setNodesState, isFilterActive}
         
        return  <ul  className='mx-5 mb-3'>
                    {nodes.map(node => <Node key={node.id} node={node} {...props} />)}
                </ul>
        }
 }

const CHECKBOX_STATUS = {
    unchecked: 'unchecked',
    checked: 'checked',
    indeterminate: 'indeterminate',
};

const Node = ({node:{ id, name, parentId}, data, nodesState, changeNodeStatus, setNodesState, isFilterActive}: NodePropsType) => {
    const [visible, toggleVisible] = useState<boolean>(false)
    const [nestedNodes, setNestedNodes] = useState<DataType[]>()
   
    const checkboxRef = useRef() as React.MutableRefObject<HTMLInputElement>

    const checkCheckbox = (status: string) => {
        //
        if (status === CHECKBOX_STATUS.checked && !checkboxRef.current.checked) {
            checkboxRef.current.checked = true
            checkboxRef.current.indeterminate = false;
        } else if (status === CHECKBOX_STATUS.unchecked && checkboxRef.current.checked || checkboxRef.current.indeterminate ) {
            checkboxRef.current.checked = false;
            checkboxRef.current.indeterminate = false;
        } else if (status === CHECKBOX_STATUS.indeterminate) {
            checkboxRef.current.checked = false
            checkboxRef.current.indeterminate = true;
        }
    }
    
    useEffect(() => {
        const nestedNodes = data.filter(el => el.parentId === id)
        setNestedNodes(nestedNodes)
        
    }, [])

    useEffect(() => {

        //nodesState[id].status
        checkCheckbox(nodesState[id])
    }, [nodesState[id]])

    //sends the new status to the node status data object
    const handleChecboxClick = () => {
        const status:string = checkboxRef.current.checked ? CHECKBOX_STATUS.checked : CHECKBOX_STATUS.unchecked
        if (nestedNodes?.length) {
            parentId? changeNodeStatus({id, status, nestedNodes, parentId, nodesState, data, setNodesState}) : changeNodeStatus({id, status, nestedNodes, nodesState, data, setNodesState})
        } else (
            parentId? changeNodeStatus({id, status, parentId, nodesState, data, setNodesState}) : changeNodeStatus({id, status, nodesState, data, setNodesState})
        ) 
    }
    const setNestedNodesVisibile = () => {
        nestedNodes?.length && toggleVisible(!visible)
    }
            
    return (

        <li className=" bg-gray-100 p-1 text-lg font-serif p-1 m-1" key={id}>

            <span onClick={setNestedNodesVisibile}  className="cursor-pointer pr-4">
                {nestedNodes?.length && (visible ? '-' : '+') || null}
            </span>
            <input type="checkbox" ref={checkboxRef} className=" w-4 h-4 bg-gray-100 rounded" onClick={handleChecboxClick}/>
            
            <label className="ml-1 text-gray-900 dark:text-gray-300 " >{id}// {nodesState[id]} //</label>
            {visible && nestedNodes && extendTreeByNestedNodes({ nodes: nestedNodes, data,  nodesState, changeNodeStatus, setNodesState, isFilterActive})}
            
        </li> 
    );
};

export default Node;
