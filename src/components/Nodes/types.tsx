export type DataType = {
    id: string;
    name: string;
    parentId: string | null;
};
export type ChangeNodeStatusFnArgsType = {
    id: string;
    status: string;
    nestedNodes?: DataType[];
    parentId?: string;
    nodesState: StateType;
    data: DataType[];
    setNodesState: React.Dispatch<React.SetStateAction<StateType>>;
};

export type PropsTypes = {
    data: DataType[];
    nodesState: StateType;
    changeNodeStatus: (args: ChangeNodeStatusFnArgsType) => void;
    setNodesState: React.Dispatch<React.SetStateAction<StateType>>;
    isFilterActive: boolean;
    CHECKBOX_STATUS: {
        unchecked: string;
        checked: string;
        indeterminate: string;
    };
};

export type NodePropsType = {
    node: DataType;
    props: PropsTypes;
};

export type ExtendTreeFnType = {
    nodes: DataType[];
    props: PropsTypes;
};

export type TreeProps = {
    data: DataType[];
};

export type StateType = {
    [index: string]: {
        id: string;
        status: string;
        parentId: string;
        name: string;
        matchesSearchTerm: boolean;
    };
};

export type FilterPropsType = {
    nodesState: StateType;
    setNodesState: React.Dispatch<React.SetStateAction<StateType>>;
    changeSearchTermMatch: (
        nodesState: StateType,
        setNodesState: React.Dispatch<React.SetStateAction<StateType>>,
        request: string,
    ) => void;
    toogleFilterActiveStatus: React.Dispatch<React.SetStateAction<boolean>>;
};
