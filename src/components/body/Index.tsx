import {SinistroForm} from '../sinistroForm/Index'
import { Routes, Route } from "react-router-dom";
import { About } from './About'
import './Index.css'
import { SinistrosList } from '../sinistrosList/Index'
import { SinistroDetails } from '../sinistroDetails/Index';
import { SinistroEdit } from '../sinistroEdit/Index';
import { LoginPage } from '../../pages/LoginPage/LoginPage';

export function Body(){
    return(
        <div className="body-container">
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/sobre" element={<About />} />
                <Route path="/cadastro" element={<SinistroForm />} />
                <Route path="/listaSinistros" element={<SinistrosList />}/>
                <Route path="/sinistros/:id" element={<SinistroDetails />}/>
                <Route path="/sinistros/editar/:id" element={<SinistroEdit />}/>

                <Route path="*" element={<About />} />
            </Routes>
            
        </div>
    )
}