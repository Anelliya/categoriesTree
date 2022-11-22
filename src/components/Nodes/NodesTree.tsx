import { useState } from 'react';
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

const changeParentStatus = (arg: type.ChangeNodeStatusFnArgType) => {
    const { nodesState, data } = arg;
    let { parentId, status, id } = arg;

    if (!data.filter(node => node.parentId === parentId).length) return;

    let updatedParentsStatus: type.NewNodesStateType = {};
    let ownParent = nodesState[parentId as keyof object].parentId;

    while (parentId) {
        const nestedNodes: type.DataType[] = data.filter(
            node => node.parentId === parentId,
        );
        const parentStatus = nodesState[id].status;
        const nestedNodesStatus: string[] = nestedNodes.map(node => {
            return node.id === id ? status : nodesState[node.id].status;
        });

        if (nestedNodesStatus.every(nodeStatus => nodeStatus === parentStatus))
            return;
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

        if (!ownParent) return updatedParentsStatus;
        status = updatedParentsStatus[parentId].status;
        id = parentId;
        parentId = ownParent;
        ownParent = nodesState[parentId].parentId;
    }
    return updatedParentsStatus;
};

const changeNestedNodesStatus = (arg: type.ChangeNodeStatusFnArgType) => {
    const { status, data, nodesState } = arg;
    let { nestedNodes } = arg;

    let updatedNestedNodesStatusData = {};

    while (nestedNodes?.length) {
        const updatedCurrentNodesData = nestedNodes.reduce((result, node) => {
            return {
                ...result,
                [node.id]: { ...nodesState[node.id], status: status },
            };
        }, {});

        updatedNestedNodesStatusData = {
            ...updatedNestedNodesStatusData,
            ...updatedCurrentNodesData,
        };
        nestedNodes = nestedNodes
            ?.map(({ id }) => data.filter(node => node.parentId === id))
            .flat();
    }
    return updatedNestedNodesStatusData;
};

const changeNodeStatus = (arg: type.ChangeNodeStatusFnArgType) => {
    const { id, status, nestedNodes, parentId, nodesState, setNodesState } =
        arg;
    const updatedParentsStatus = parentId && changeParentStatus(arg);
    const updatedNestedNodesStatus =
        nestedNodes && changeNestedNodesStatus(arg);
    const updatedCurrentStatus = { ...nodesState[id], status: status };

    if (updatedNestedNodesStatus && CHECKBOX_STATUS.indeterminate) {
        updatedParentsStatus
            ? setNodesState({
                  ...nodesState,
                  [id]: updatedCurrentStatus,
                  ...updatedNestedNodesStatus,
                  ...updatedParentsStatus,
              })
            : setNodesState({
                  ...nodesState,
                  [id]: updatedCurrentStatus,
                  ...updatedNestedNodesStatus,
              });
    } else {
        updatedParentsStatus
            ? setNodesState({
                  ...nodesState,
                  [id]: updatedCurrentStatus,
                  ...updatedParentsStatus,
              })
            : setNodesState({ ...nodesState, [id]: updatedCurrentStatus });
    }
};

const changeSearchTermMatch = (
    nodesState: type.NewNodesStateType,
    request: string,
) => {
    const searchTerm = request.toLowerCase();

    const handledCategories: { [index: string]: number } = {};

    //at the beginning sets the category match status to false
    for (const categoryId in nodesState) {
        nodesState[categoryId].matchesSearchTerm = false;

        let currentCategory = nodesState[categoryId];

        //checks if the current category matches the search
        const matches = currentCategory.name
            .toLocaleLowerCase()
            .includes(searchTerm);

        //if the current category does't match the search, moves on to the next category
        if (!matches) {
            continue;
        }

        //checks if current category has already been handled and moves on to the next category if has been
        if (handledCategories[currentCategory.id]) {
            continue;
        }

        //updates the current category matchesSearchTerm key to true or false depending on the validation result
        nodesState[currentCategory.id].matchesSearchTerm = matches;

        //enters the condition while the current category has a parent
        while (currentCategory.parentId) {
            //sets the parent as current category
            currentCategory = nodesState[currentCategory.parentId];
            nodesState[currentCategory.id].matchesSearchTerm = matches;
            //adds current category to handled categories object
            handledCategories[currentCategory.id] = 1;
        }
    }
};

const NodesTree = ({ data }: type.TreeProps) => {
    const [nodesState, setNodesState] = useState<type.NewNodesStateType>(
        createNodesTreeState(data),
    );
    const [isFilterActive, toogleFilterActiveStatus] = useState<boolean>(false);
    const rootNodes = getNodesList(null, data);

    const props = {
        data,
        nodesState,
        changeNodeStatus,
        changeParentStatus,
        setNodesState,
        isFilterActive,
    };

    return (
        <>
            <Filter
                nodesState={nodesState}
                toogleFilterActiveStatus={toogleFilterActiveStatus}
                changeSearchTermMatch={changeSearchTermMatch}
            />
            <ul className="mr-3">
                <ViewportList items={rootNodes} margin={8}>
                    {item => <Node node={item} {...props} key={item.id} />}
                </ViewportList>
            </ul>
        </>
    );
};

export default NodesTree;
