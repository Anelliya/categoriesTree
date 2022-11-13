import CategoriesTree from './components/CategoriesTree';
import Filter from './components/Filter';
import './index.css';

const App = () => {
    return (
        <div className="container xl px-4 border  p-10">
            <Filter />
            <CategoriesTree />
        </div>
    );
};

export default App;
