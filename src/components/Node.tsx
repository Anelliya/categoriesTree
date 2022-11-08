import React from "react";
// import React, { useEffect, useState, useRef, SyntheticEvent } from "react";
// import { useAppSelector, useAppDispatch } from '../hook'
// import { toggleNodesStatus, addNodeStatus } from '../redux/nodesSlice';

// //import { getNodeStatus } from '../redux/selectors';

// declare module 'react' {
//   interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
//     indeterminate?: boolean;
//   }
// }

// type NodeType = {
//   name: string,
//   id: string,
//   children: NodeType[],
//   checked?: string,
//   sendStatus?: (id: string, checkedStatus: string) => void,
//   parentStatus?: string | null
//   fn?:(id:string)=> void
  
// };

// type ChildrenStatusType = {
//   id: string,
//   checkedStatus: string 
// }

// const CHECKED_STATUS = {
//   unchecked: 'unchecked',
//   checked: 'checked',
//   indeterminate: 'indeterminate',
// }

// function Node({ name, id, children, checked = CHECKED_STATUS.unchecked, sendStatus, parentStatus, fn }: NodeType): JSX.Element {
  
//   const nodesStatus = useAppSelector((state) => state.nodesStatus)
//   const dispatch = useAppDispatch()

//   const [isChildrenVisible, setChildrenVisible] = useState<boolean>(false)
//   const [checkedStatus, setCheckedStatus] = useState<string | null>(getNodeStatus(nodesStatus, id))
//   const [collapse, setCollapse] = useState<boolean>(true)
//   const [childrenStatus, setChildrenStatus] = useState<ChildrenStatusType[]>()

//   const checkboxRef = useRef() as React.MutableRefObject<HTMLInputElement>

//    function getStatusFromState(currentId: string): string {
//       if (nodesStatus.find(el => el.id === currentId)) {
//         const node = nodesStatus.find(el => el.id === currentId)
//         return node?.status as string
//       } return CHECKED_STATUS.unchecked
//     }
  
//   useEffect(() => {
 
//     setChildrenStatus(children.map(el => ({ 'id': el.id, 'checkedStatus': getStatusFromState(el.id) })))
//   }, [])
   
//   useEffect(() => {
//     if (parentStatus === CHECKED_STATUS.indeterminate) {
//       return
//     }
//     setCheckedStatus(parentStatus as string)
//   }, [parentStatus])

  
//   useEffect(() => {
//      if (checkedStatus === CHECKED_STATUS.checked) {
//       checkboxRef.current.checked = true;
//       checkboxRef.current.indeterminate = false;
//     } else if (checkedStatus === CHECKED_STATUS.unchecked) {
//       checkboxRef.current.checked = false;
//       checkboxRef.current.indeterminate = false;
//     } else if (checkedStatus === CHECKED_STATUS.indeterminate) {
//       checkboxRef.current.checked = false;
//       checkboxRef.current.indeterminate = true;
//     }
//     const status = checkedStatus

//     dispatch(toggleNodesStatus({ id, status }))

//   }, [checkedStatus]);
  
//   useEffect(() => {
//   }, [checked])
  
//   useEffect(() => {
//     if (sendStatus && checkedStatus !== null) {
//       sendStatus(id, checkedStatus)
//     }
//   }, [checkedStatus])


//   useEffect(() => {
    
//     if (childrenStatus?.length! > 0) {
//       if (childrenStatus?.every(el => el.checkedStatus === CHECKED_STATUS.checked)) {
//         checkboxRef.current.indeterminate = false
//         setCheckedStatus(CHECKED_STATUS.checked)
//       }
//       if (childrenStatus?.every(el => el.checkedStatus === CHECKED_STATUS.unchecked)) {
//         setCheckedStatus(CHECKED_STATUS.unchecked)
//       }
//       if (childrenStatus?.some(el => el.checkedStatus === CHECKED_STATUS.indeterminate)){
//         setCheckedStatus(CHECKED_STATUS.indeterminate)
//       }

//       if (childrenStatus?.some(el => el.checkedStatus === CHECKED_STATUS.checked) && childrenStatus?.some(el => el.checkedStatus === CHECKED_STATUS.unchecked || el.checkedStatus === CHECKED_STATUS.indeterminate)) {
//         setCheckedStatus(CHECKED_STATUS.indeterminate)
//       } 
//     }
//   }, [childrenStatus])



//   const handleChildrenStatus = (id: string, checkedStatus: string) => {
//     setChildrenStatus(childrenStatus?.map(child => { if (child.id === id) { child.checkedStatus = checkedStatus } return child }))
//   }

//   const handleChildrenVisibility = () => {
//     if (children.length > 0) {
//       setChildrenVisible(!isChildrenVisible)
//       setCollapse(!collapse)
//     }
//   };


//   const childStatus = (id:string):void=>  {
//     if (childrenStatus !== undefined) {
//       const child =  childrenStatus?.find(child => child.id === id)
//     }
//   }


//   const handleClick = (e: SyntheticEvent) => {
//     if (checkedStatus === CHECKED_STATUS.checked) {
//       setCheckedStatus(CHECKED_STATUS.unchecked)
//     } else if (checkedStatus === CHECKED_STATUS.unchecked || checkedStatus === CHECKED_STATUS.indeterminate) {
//       setCheckedStatus(CHECKED_STATUS.checked)
//     }
    
//     if (sendStatus && checkedStatus !== null) {
//       const target = e.target as HTMLInputElement;
//       const { id } = target
//       sendStatus(id, checkedStatus)
//     }
//   } 
 
//   return (
//     <li key={id} className="drop-shadow-md hover:drop-shadow-2xl bg-gray-100 p-1 text-lg font-serif p-2 m-1">
//       <span className="cursor-pointer pr-4" onClick={handleChildrenVisibility} >
//         {children.length > 0 && (collapse ? '+' : "-") }
//       </span>
      
//       <input type="checkbox" id={id} onClick={handleClick}  ref={checkboxRef}
//         className=" w-4 h-4 bg-gray-100 rounded" />
      
//       <label className="ml-1 text-gray-900 dark:text-gray-300 ">{name}</label  >
      
//         {isChildrenVisible &&        
//           <ul>
//           {children?.map(child => <Node {...child} sendStatus={handleChildrenStatus} fn={()=> childStatus(child.id) }  parentStatus={checkedStatus? checkedStatus : null}/>)}
//           </ul>
//         }
//       </li>
//     );
//   }

// export default Node;

// // атрибут из импут  checked={checkedStatus}
//  // трибути из рекурсии checked={checkedStatus} parentStatus={checkedStatus}