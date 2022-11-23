import { useEffect, useState } from 'react';
import ViewportList from 'react-viewport-list';
import * as type from './types';
import Node from './Node';
import Filter from './Filter';

const CHECKBOX_STATUS = {
    unchecked: 'unchecked',
    checked: 'checked',
    indeterminate: 'indeterminate',
};

const getNodesList = (
    parentId: string | null,
    data: type.DataType[],
): type.DataType[] => {
    return data.filter(el => el.parentId === parentId);
};

// creates initial collection to the "HashMap" (object) of key-value pairs
// for faster search by id.
const createNodesTreeState = (nodes: type.DataType[], status?: string) => {
    return nodes.reduce((result, node) => {
        const { name, id, parentId } = node;
        return {
            ...result,
            [id]: {
                id: id,
                status: status ? status : CHECKBOX_STATUS.unchecked,
                parentId: parentId,
                name: name,
                matchesSearchTerm: false,
            },
        };
    }, {});
};

//creates and returns updated data of parents
const updateParentStatus = (args: type.ChangeNodeStatusFnArgsType) => {
    const { nodesState, data } = args;
    let { parentId, status, id } = args;

    //data to return
    let updatedParentsStatus: type.StateType = {};

    while (parentId) {
        //the child node statuses of the current parent node
        const nestedNodesStatus: string[] = data
            .filter(node => node.parentId === parentId)
            .map(node => {
                return node.id === id ? status : nodesState[node.id].status;
            });
        //the current parent node status
        const parentStatus = nodesState[id].status;

        //does nothing if every child has the same status as a parent
        if (
            nestedNodesStatus.every(nodeStatus => nodeStatus === parentStatus)
        ) {
            return;
        }

        if (
            nestedNodesStatus.every(
                nodeStatus => nodeStatus === CHECKBOX_STATUS.checked,
            ) &&
            parentStatus !== CHECKBOX_STATUS.checked
        ) {
            updatedParentsStatus = {
                ...updatedParentsStatus,
                [parentId]: {
                    ...nodesState[parentId],
                    status: CHECKBOX_STATUS.checked,
                },
            };
        } else if (
            nestedNodesStatus.every(
                nodeStatus => nodeStatus === CHECKBOX_STATUS.unchecked,
            ) &&
            parentStatus !== CHECKBOX_STATUS.unchecked
        ) {
            updatedParentsStatus = {
                ...updatedParentsStatus,
                [parentId]: {
                    ...nodesState[parentId],
                    status: CHECKBOX_STATUS.unchecked,
                },
            };
        } else if (
            nestedNodesStatus.some(nodeStatus => nodeStatus !== parentStatus)
        ) {
            updatedParentsStatus = {
                ...updatedParentsStatus,
                [parentId]: {
                    ...nodesState[parentId],
                    status: CHECKBOX_STATUS.indeterminate,
                },
            };
        }

        // The parent node of current parent
        const ownParent = nodesState[parentId as keyof object].parentId;

        if (!ownParent) {
            //stop iterations when the current parent is a root node
            return updatedParentsStatus;
        }
        //assigns the updated current parent's status as the status for the next iteration
        status = updatedParentsStatus[parentId].status;
        //assigns the current parent's id as a child id
        id = parentId;
        //assigns the current parent's parent id as parent id for the next iteration
        parentId = ownParent;
    }

    return updatedParentsStatus;
};

//creates and returns updated status data of child nodes
const updateNestedNodesStatus = (args: type.ChangeNodeStatusFnArgsType) => {
    const { status, data, nodesState } = args;
    let { nestedNodes } = args;

    //data to return
    let updatedNestedNodesData = {};

    while (nestedNodes?.length) {
        const updatedCurrentNodesData = nestedNodes.reduce((result, node) => {
            return {
                ...result,
                [node.id]: { ...nodesState[node.id], status: status },
            };
        }, {});

        updatedNestedNodesData = {
            ...updatedNestedNodesData,
            ...updatedCurrentNodesData,
        };

        //assigns nested nodes of current nested nodes as nested nodes for the next iteration
        nestedNodes = nestedNodes
            ?.map(({ id }) => data.filter(node => node.parentId === id))
            .flat();
    }
    return updatedNestedNodesData;
};

const changeNodeStatus = (args: type.ChangeNodeStatusFnArgsType) => {
    const { id, status, nestedNodes, parentId, nodesState, setNodesState } =
        args;
    const updatedParentsStatus = parentId ? updateParentStatus(args) : null;
    const updatedNestedNodesStatus = nestedNodes
        ? updateNestedNodesStatus(args)
        : null;
    const updatedCurrentStatus = { ...nodesState[id], status: status };

    let nodesStateData;

    if (updatedNestedNodesStatus) {
        nodesStateData = updatedParentsStatus
            ? {
                  ...nodesState,
                  [id]: updatedCurrentStatus,
                  ...updatedNestedNodesStatus,
                  ...updatedParentsStatus,
              }
            : {
                  ...nodesState,
                  [id]: updatedCurrentStatus,
                  ...updatedNestedNodesStatus,
              };
    } else {
        nodesStateData = updatedParentsStatus
            ? {
                  ...nodesState,
                  [id]: updatedCurrentStatus,
                  ...updatedParentsStatus,
              }
            : { ...nodesState, [id]: updatedCurrentStatus };
    }
    //sets nodes's state with updated data
    setNodesState(nodesStateData);
};

const changeSearchTermMatch = (
    nodesState: type.StateType,
    setNodesState: React.Dispatch<React.SetStateAction<type.StateType>>,
    request: string,
) => {
    const searchTerm = request.toLowerCase();

    //data to set to state
    let updatedMatchSerchTerm = {};

    for (const node in nodesState) {
        const matches = nodesState[node].name
            .toLocaleLowerCase()
            .includes(searchTerm);

        const data = {
            [nodesState[node].id]: {
                ...nodesState[node],
                matchesSearchTerm: matches,
            },
        };

        if (matches) {
            let currentCategory = nodesState[node];
            while (currentCategory.parentId) {
                const data = {
                    [currentCategory.parentId]: {
                        ...nodesState[currentCategory.parentId],
                        matchesSearchTerm: matches,
                    },
                };

                updatedMatchSerchTerm = { ...updatedMatchSerchTerm, ...data };
                currentCategory = nodesState[currentCategory.parentId];
            }
        }

        updatedMatchSerchTerm = { ...updatedMatchSerchTerm, ...data };
    }

    setNodesState(updatedMatchSerchTerm);
};

const NodesTree = ({ data }: type.TreeProps) => {
    const [nodesState, setNodesState] = useState<type.StateType>(
        createNodesTreeState(data),
    );
    const [isFilterActive, toogleFilterActiveStatus] = useState<boolean>(false);

    //gets the root categories
    const rootNodes = getNodesList(null, data);

    const props = {
        data,
        nodesState,
        changeNodeStatus,
        updateParentStatus,
        setNodesState,
        isFilterActive,
        CHECKBOX_STATUS,
    };

    return (
        <>
            <Filter
                nodesState={nodesState}
                setNodesState={setNodesState}
                toogleFilterActiveStatus={toogleFilterActiveStatus}
                changeSearchTermMatch={changeSearchTermMatch}
            />
            <ul className="mr-3">
                <ViewportList items={rootNodes} margin={8}>
                    {item => <Node node={item} props={props} key={item.id} />}
                </ViewportList>
            </ul>
        </>
    );
};

export default NodesTree;
