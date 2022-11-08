import { useEffect, useState } from "react";
import { VariableSizeList as List } from 'react-window';
import { useAppSelector, useAppDispatch } from '../hook'
import { getRootCategories } from '../redux/selectors';

import Category from './Category'
import {CategoriesType, CategoryType} from '../types'



function CategoriesTree(): JSX.Element {

  const [rootCategories, setRootCategories] = useState<CategoriesType>();
  
  const childrenState = useAppSelector(state => state.categoriesChildren)
  const categoriesState = useAppSelector(state => state.categories)
  //console.log(categoriesState)
  
  const rootCategoriesArr = getRootCategories(childrenState, categoriesState)

  useEffect(() => {
    //setRootCategories(rootCategoriesArr)
  },[])
 
  return (
    <>
     <ul>
        {rootCategoriesArr && rootCategoriesArr.map((rootCategory: CategoryType ) => <Category {...rootCategory} />)}
      </ul>
  </>
  
  );
}

export default CategoriesTree