import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/Auth/Login';
import Manager from "../src/pages/index";

interface IProps {
    
}

function BaseWebRouter(props: IProps) {
    return (
        <BrowserRouter>

            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/profile' element={<Manager />} />
            </Routes>
        </BrowserRouter>
    );
}

export default BaseWebRouter;