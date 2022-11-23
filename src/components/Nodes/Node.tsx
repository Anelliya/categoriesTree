import { useEffect, useState, useRef } from 'react';
import * as type from './types';

//render nested nodes
const extendTreeByNestedNodes = ({ nodes, props }: type.ExtendTreeFnType) => {
    return (
        <ul className="mx-5 mb-3">
            {nodes.map(node => (
                <Node key={node.id} node={node} props={props} />
            ))}
        </ul>
    );
};

const Node = ({ node, props }: type.NodePropsType) => {
    const [visible, toggleVisible] = useState<boolean>(false);
    const [nestedNodes, setNestedNodes] = useState<type.DataType[]>();

    const {
        data,
        nodesState,
        changeNodeStatus,
        setNodesState,
        isFilterActive,
        CHECKBOX_STATUS,
    } = props;
    const { id, name, parentId } = node;

    const checkboxRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    //set checkbox checked/unchecked/indeterminate depending on received status data
    const setCheckbox = async (status: string) => {
        if (!checkboxRef.current) {
            return;
        }
        if (status === CHECKBOX_STATUS.checked) {
            checkboxRef.current.checked = true;
            checkboxRef.current.indeterminate = false;
        } else if (status === CHECKBOX_STATUS.unchecked) {
            checkboxRef.current.checked = false;
            checkboxRef.current.indeterminate = false;
        } else if (status === CHECKBOX_STATUS.indeterminate) {
            checkboxRef.current.checked = false;
            checkboxRef.current.indeterminate = true;
        }
    };

    useEffect(() => {
        //gets child nodes data
        const nestedNodes = data.filter(el => el.parentId === id);
        setNestedNodes(nestedNodes);
        setCheckbox(nodesState[id].status);
    }, []);

    useEffect(() => {
        //checks the checkbox for every status change
        setCheckbox(nodesState[id].status);
    }, [nodesState[id]]);

    useEffect(() => {
        //matchesSearchTerm returns true if the current category matching the search
        if (!isFilterActive) {
            setCheckbox(nodesState[id].status);
        }
        if (nodesState[id].matchesSearchTerm) {
            toggleVisible(nodesState[id].matchesSearchTerm);
        }
    }, [isFilterActive, nodesState]);

    const handleChecboxClick = () => {
        const status: string = checkboxRef.current.checked
            ? CHECKBOX_STATUS.checked
            : CHECKBOX_STATUS.unchecked;

        const params = { id, status, nodesState, data, setNodesState };

        let nodeStatusData;

        if (nestedNodes?.length) {
            nodeStatusData = parentId
                ? { ...params, parentId, nestedNodes }
                : { ...params, nestedNodes };
        } else {
            nodeStatusData = parentId ? { ...params, parentId } : { ...params };
        }

        changeNodeStatus(nodeStatusData);
    };

    const setNestedNodesVisibile = () => {
        //does nothing if node doesn't have child nodes
        if (nestedNodes?.length) {
            toggleVisible(!visible);
        }
    };

    return (
        //if the filter is active, the current node is rendered only if it matches the search criteria
        <>
            {(!isFilterActive || nodesState[id].matchesSearchTerm) && (
                <li
                    className=" bg-gray-100 p-1 text-lg font-serif p-1 m-1"
                    key={id}
                >
                    <span
                        onClick={setNestedNodesVisibile}
                        className="cursor-pointer pr-4"
                    >
                        {(nestedNodes?.length && (visible ? '-' : '+')) || null}
                    </span>

                    <input
                        type="checkbox"
                        ref={checkboxRef}
                        className=" w-4 h-4 bg-gray-100 rounded"
                        onClick={handleChecboxClick}
                    />

                    <label className="ml-1 text-gray-900 dark:text-gray-300 ">
                        {name}
                    </label>

                    {visible &&
                        nestedNodes &&
                        extendTreeByNestedNodes({
                            nodes: nestedNodes,
                            props: props,
                        })}
                </li>
            )}
        </>
    );
};

export default Node;
