import { useAppSelector } from '../hook';
import { getRootCategories } from '../redux/selectors';
import ViewportList from 'react-viewport-list';

import Category from './Category';

const CategoriesTree = (): JSX.Element => {
    const childrenState = useAppSelector(state => state.categoriesChildren);
    const categoriesState = useAppSelector(state => state.categories);

    //gets the root categories to render it
    const rootCategoriesArr = getRootCategories(childrenState, categoriesState);

    return (
        <ul >
            <ViewportList items={rootCategoriesArr} margin={8}>
                {item => <Category {...item} key={item.id} />}
            </ViewportList>
        </ul>
    );
};

export default CategoriesTree;
