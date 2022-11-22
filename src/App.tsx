// import CategoriesTree from './components/Category/CategoriesTree';
import Filter from './components/Category/Filter';
import NodesTree2 from './components/Nodes/NodesTree';
import data from './categories.json'

import './index.css';

const App = () => {
    return (
        <div className="container xl px-4 border  p-10">
            {/* <Filter /> */}
            {/* <CategoriesTree /> */}
            <NodesTree2 data={data} />
        </div>
    );
};

export default App;
