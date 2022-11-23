import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { FilterPropsType } from './types';

const Filter = ({
    nodesState,
    toogleFilterActiveStatus,
    changeSearchTermMatch,
    setNodesState,
}: FilterPropsType) => {
    const [filterValue, setFilterValue] = useState<string>('');

    useEffect(() => {
        const debounceFn = debounce(() => {
            //set the active status of filter field
            toogleFilterActiveStatus(filterValue.length > 0);

            if (filterValue) {
                //sends the value of filter field for the searching of matching categories
                changeSearchTermMatch(nodesState, setNodesState, filterValue);
            }
        }, 500);
        debounceFn();
        return () => debounceFn.cancel();
    }, [filterValue]);

    const handleWriteFiltreValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFilterValue(e.target.value);
    };

    return (
        <input
            type="text"
            onChange={handleWriteFiltreValue}
            placeholder="Filter by name..."
            className="drop-shadow-md hover:drop-shadow-2xl bg-gray-100 p-1 text-lg font-serif p-2 m-1"
        />
    );
};

export default Filter;
