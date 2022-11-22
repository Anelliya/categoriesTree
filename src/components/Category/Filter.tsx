import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hook';

import { setIsActive, changeSearchTermMatch } from '../../redux/categorySlice';

import { debounce } from 'lodash';

const Filter = () => {
    const [filterValue, setFilterValue] = useState<string>('');

    const dispatch = useAppDispatch();

    useEffect(() => {
        const debounceFn = debounce(() => {
            //set the active status of filter field
            dispatch(setIsActive(filterValue.length > 0));

            if (filterValue) {
                //dispatches the value of filter field for the searching of matching categories
                dispatch(changeSearchTermMatch(filterValue));
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
