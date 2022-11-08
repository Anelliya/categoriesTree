import { useEffect, useState, useRef, SyntheticEvent } from "react"
import {  changeStatus } from '../redux/categorySlice';
import { getChildrenByParentId, getChildrensIds,getParentStatus , categoryHasChildren, getStatus, getChildrenStatus} from '../redux/selectors'
import { useAppSelector, useAppDispatch } from '../hook'

import {CategoriesType, ChildrenType, CategoryType} from '../types'

const CHECKBOX_STATUS = {
  unchecked: 'incheked',
  checked: 'checked',
  indeterminate: 'indeterminate'
}

const Category = ({id, name, parentId, status}: CategoryType) => {
    const [collapsed, setCollapsed] = useState<boolean>(true)
    const [childrenVisible, setChildrenVisible] = useState<boolean>(false)
    const [childrenIds, setChildrenIds] = useState<string[] | null>([])
   
    
    const childrenState = useAppSelector(store => store.categoriesChildren)
    const categoriesState = useAppSelector(state => state.categories)

    const dispatch = useAppDispatch()
    const checkboxRef = useRef() as React.MutableRefObject<HTMLInputElement>

    const hasChildren = categoryHasChildren(childrenState, id)
    const parentStatus = getParentStatus(categoriesState, id)
    const categoryStatus = getStatus(categoriesState, id)
    const childrenStatus = getChildrenStatus(categoriesState, childrenIds as [])
     
            console.log('childrenIds', childrenIds)

    
     useEffect(() => {
         setChildrenIds(getChildrensIds(childrenState, id))
    }, [])

    useEffect(() => {
        if (categoryStatus === 'checked') {
            checkboxRef.current.checked = true
            checkboxRef.current.indeterminate = false
        }
        else if (categoryStatus === 'unchecked') {
            checkboxRef.current.checked = false
            checkboxRef.current.indeterminate = false
        }
        // else if (categoryStatus === 'indeterminate') {
        //     checkboxRef.current.checked = false
        //     checkboxRef.current.indeterminate = true
        // }
        
    }, [categoryStatus])

    useEffect(() => {
       let status
        if (childrenStatus?.length > 0) {
            if (childrenStatus.every(status => status === 'checked') && categoryStatus !== 'checked') {
                checkboxRef.current.indeterminate = false
                status = 'checked'
                dispatch(changeStatus({ id, status, childrenIds, childrenState }))
            } else if (childrenStatus.every(status => status === 'unchecked') && categoryStatus !== 'unchecked') {
                checkboxRef.current.indeterminate = false

                status = 'unchecked'
                dispatch(changeStatus({ id, status, childrenIds, childrenState }))
            } 
            else if(childrenStatus.some(status => status === 'checked') && childrenStatus.some(status => status === 'unchecked') || childrenStatus.some(status => status === 'indeterminate')){
               status = 'indeterminate'
               dispatch(changeStatus({id, status , childrenIds, childrenState}))
               checkboxRef.current.indeterminate = true
            }
        }
        
    }, [childrenStatus])

        
    const handleCheckboxClick = (e: SyntheticEvent) => {
        if (checkboxRef.current.checked) {
            const status = 'checked'
            console.log("handle click send children id", childrenIds)
            dispatch(changeStatus({id, status , childrenIds, childrenState}))
           
        } else if (!checkboxRef.current.checked) {
            console.log("handle click send children id", childrenIds)

            const status = 'unchecked'
            dispatch(changeStatus({id, status , childrenIds, childrenState}))
       }
    } 

    function handleRenderChildren() {
        setChildrenVisible(!childrenVisible)
        setCollapsed(!collapsed)
    }

    function renderChildren() {
        const children = getChildrenByParentId(childrenState, categoriesState, id) 
        return ( <ul>
                    {children?.map(child => <Category {...child}/>)}
                </ul>)
    }

    return (
        <>
            <li key={id} className="drop-shadow-md hover:drop-shadow-2xl bg-gray-100 p-1 text-lg font-serif p-2 m-1">
                <span className="cursor-pointer pr-4" onClick={handleRenderChildren}>
                    {hasChildren && (collapsed ? '+' : "-")}
                </span>
                <input type="checkbox" id={id} ref={checkboxRef} onClick={handleCheckboxClick} className=" w-4 h-4 bg-gray-100 rounded"/>
                
                <label className="ml-1 text-gray-900 dark:text-gray-300 ">
                    {id}
                </label >

                {childrenVisible &&  renderChildren()}
            </li> 
        </>
    )
}

 export default Category