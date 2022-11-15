import { useEffect, useState, useRef } from 'react';
import { changeStatus, changeChildrenVisibility } from '../redux/categorySlice';
import {
    getChildrenByParentId,
    getChildrensIds,
    categoryHasChildren,
    getChildrenStatus,
} from '../redux/selectors';

import { useAppSelector, useAppDispatch } from '../hook';

import { CategoryType } from '../types';

const CHECKBOX_STATUS = {
    unchecked: 'unchecked',
    checked: 'checked',
    indeterminate: 'indeterminate',
};

const Category = ({
    id,
    name,
    matchesSearchTerm,
    status,
    childrenVisibility
}: CategoryType) => {
    const [childrenIds, setChildrenIds] = useState<string[] | null>([]);

    // returns children state as an object of parentId: {...children ids}
    const childrenState = useAppSelector(state => state.categoriesChildren);
    const categoriesState = useAppSelector(state => state.categories); // returns main state

    const dispatch = useAppDispatch();
    const checkboxRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    //returns the children's ids array
    const hasChildren = categoryHasChildren(childrenState, id); 

    //returns array of children's checkbox status
    const childrenStatus = getChildrenStatus(
        categoriesState,
        childrenIds as [],
    ); 

    //gets the status of filter fiels (if searching is in progress or not)
    const filter = useAppSelector(state => state.filter); 

    const dispatchStatusChange = (status: string) => {
        dispatch(
            changeStatus({
                id,
                status,
                childrenIds,
                childrenState,
            }),
        );
    };

    //set checkbox checked/unchecked/indeterminate depending on current category's status
    const setCheckbox = () => {
        if (status === CHECKBOX_STATUS.checked) {
                checkboxRef.current.checked = true;
                checkboxRef.current.indeterminate = false;
            } else if (status === CHECKBOX_STATUS.unchecked) {
                checkboxRef.current.checked = false;
                checkboxRef.current.indeterminate = false;
            } else if (status === CHECKBOX_STATUS.indeterminate) {
                checkboxRef.current.indeterminate = true;
            
        }
    }

    useEffect(() => {
        setChildrenIds(getChildrensIds(childrenState, id)); //returns array of children ids if they are
        if (checkboxRef.current) {
            //sets checkbox depending on the received category state status
            setCheckbox()
        }
    }, []);

    useEffect(() => {
        //returns true when filter search is in progress
        if (!filter.isActive) {
            //sets checkbox checked/unchecked/indeterminate depending on the received status
            setCheckbox()
            return;
        }
        //matchesSearchTerm returns true if the current category matching the search
        dispatch(changeChildrenVisibility({ isChildrenVisible: matchesSearchTerm, id }))
        
    }, [filter]); 

    useEffect(() => {
        if (checkboxRef.current) {
            //sets checkbox checked/unchecked/indeterminate depending on the received status
            setCheckbox()
        }
        
    }, [status]);

    useEffect(() => {
        //sets checkbox checked/unchecked/indeterminate depending on children's statuses
        if (
            childrenStatus?.every(
                childStatus =>
                    childStatus === CHECKBOX_STATUS[status as keyof object],
            )
        ) {
            //does nothing if both, children and parent, have the same status
            return; 
        } else if (
            childrenStatus?.every(
                childStatus => childStatus === CHECKBOX_STATUS.checked,
            )
        ) {
            // sets the checked status to parent, if all children are checked
            dispatchStatusChange(CHECKBOX_STATUS.checked); 
        } else if (
            childrenStatus?.every(
                childStatus => childStatus === CHECKBOX_STATUS.unchecked,
            )
        ) {
            //sets the unchecked status to parent, if all children are unchecked
            dispatchStatusChange(CHECKBOX_STATUS.unchecked); 
        } else if (
            childrenStatus?.some(childStatus => childStatus !== status) &&
            status !== CHECKBOX_STATUS.indeterminate
        ) {
            // sets the indeterminate status to parent only if at least one child has diferent status from parent
            dispatchStatusChange(CHECKBOX_STATUS.indeterminate); 
        }
    }, [childrenStatus]);

    const handleCheckboxClick = () => {
        // updates the status in the state based on the current checkbox status
        dispatchStatusChange(
            checkboxRef.current.checked
                ? CHECKBOX_STATUS.checked
                : CHECKBOX_STATUS.unchecked,
        ); 
    };

    const handleChildrenVisibility = () => {
        // toggles children visibility
        dispatch(changeChildrenVisibility({isChildrenVisible:!childrenVisibility, id}))
    };

    const getChildren = () => {
        //returns all children or filtered children depending on filter status
        const children = getChildrenByParentId(
            childrenState,
            categoriesState,
            id,
        );
        return filter.isActive
            ? children.filter(child => child.matchesSearchTerm)
            : children;
    };

    const renderChildren = () => {
        // recursively renders a list of children
        return (
            <ul className='mx-5 mb-3'>
                {getChildren()?.map(child => (
                    <Category {...child} key={child.id} />
                ))}
            </ul>
        );
    };

    return (
        // if the filter is in progress the current element is shown only if it matches the search term
        <>
            {(!filter.isActive || matchesSearchTerm) && ( 
                <li
                    key={id}
                    className=" bg-gray-100 p-1 text-lg font-serif p-1 m-1"
                >
                    <span
                        className="cursor-pointer pr-4"
                        onClick={handleChildrenVisibility}
                    >
                        {hasChildren && (childrenVisibility ? '-' : '+')}
                    </span>
                    <input
                        type="checkbox"
                        ref={checkboxRef}
                        onClick={handleCheckboxClick}
                        className=" w-4 h-4 bg-gray-100 rounded"
                    />
                    <label className="ml-1 text-gray-900 dark:text-gray-300 ">
                        {name}
                    </label>
                    {childrenVisibility && childrenIds?.length && renderChildren()}
                </li>
            )}
        </>
    );
};

export default Category;
