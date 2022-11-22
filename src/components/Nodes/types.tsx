export type DataType = {
    id: string;
    name: string;
    parentId: string | null;
};
export type ChangeNodeStatusFnArgType = {
    id: string;
    status: string;
    nestedNodes?: DataType[];
    parentId?: string;
    nodesState: NewNodesStateType;
    // nodesState:  NodesStateType,
    data: DataType[];
    // setNodesState: React.Dispatch<React.SetStateAction<NodesStateType>>
    setNodesState: React.Dispatch<React.SetStateAction<NewNodesStateType>>;
};

export type NodePropsType = {
    data: DataType[];
    node: DataType;
    nodesState: NewNodesStateType;
    // nodesState: NodesStateType,
    changeNodeStatus: (arg: ChangeNodeStatusFnArgType) => void;
    setNodesState: React.Dispatch<React.SetStateAction<NewNodesStateType>>;
    // setNodesState: React.Dispatch<React.SetStateAction<NodesStateType>>,
    isFilterActive: boolean;
};

export type ExtendTreeFnType = {
    nodes: DataType[];
    data: DataType[];
    nodesState: NewNodesStateType;
    // nodesState: NodesStateType,
    changeNodeStatus: (arg: ChangeNodeStatusFnArgType) => void;
    // setNodesState: React.Dispatch<React.SetStateAction<NodesStateType>>,
    setNodesState: React.Dispatch<React.SetStateAction<NewNodesStateType>>;

    isFilterActive: boolean;
};

export type TreeProps = {
    data: DataType[];
};

export type NodesStateType = {
    [index: string]: string;
};

export type NewNodesStateType = {
    [index: string]: {
        id: string;
        status: string;
        parentId: string;
        name: string;
        matchesSearchTerm: boolean;
    };
};

export type UpdatedParentsStatusType = {
    [index: string]: string;
};

export type FilterPropsType = {
    // nodesState: NodesStateType,
    nodesState: NewNodesStateType;
    changeSearchTermMatch: (
        nodesState: NewNodesStateType,
        request: string,
    ) => void;
    toogleFilterActiveStatus: React.Dispatch<React.SetStateAction<boolean>>;
};
