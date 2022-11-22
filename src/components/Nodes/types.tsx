export type DataType = {
    id: string,
    name: string,
    parentId: string | null
}
export type ChangeNodeStatusFnArgType = {
    id: string,
    status: string,
    nestedNodes?: DataType[],
    parentId?: string,
    nodesState:  NodesStateType,
    data: DataType[],
    setNodesState: React.Dispatch<React.SetStateAction<NodesStateType>>
}

export type NodePropsType = {
    data: DataType[]
    node: DataType,
    nodesState: NodesStateType,
    changeNodeStatus: (arg: ChangeNodeStatusFnArgType) => void,
    setNodesState: React.Dispatch<React.SetStateAction<NodesStateType>>,
    isFilterActive:  boolean,
}

export type ExtendTreeFnType = {
    nodes: DataType[],
    data: DataType[],
    nodesState: NodesStateType,
    changeNodeStatus: (arg: ChangeNodeStatusFnArgType) => void,
    setNodesState: React.Dispatch<React.SetStateAction<NodesStateType>>,
    isFilterActive:  boolean,
}

export type TreeProps = {
    data: DataType[]
}

export type NodesStateType = {
    [index:string]: string
}

export type UpdatedParentsStatusType = {
     [index: string]: string
}

export type FilterPropsType = {
    nodesState: NodesStateType,
    toogleFilterActiveStatus: React.Dispatch<React.SetStateAction<boolean>>
}

// export type FilterResultType = {
//      string []
// }
