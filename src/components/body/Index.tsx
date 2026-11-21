import {SinistroForm} from '../sinistroForm/Index'
import { Routes, Route } from "react-router-dom";
import { About } from './About'
import './Index.css'
import { SinistrosList } from '../sinistrosList/Index'
import { SinistroDetails } from '../sinistroDetails/Index';
import { SinistroEdit } from '../sinistroEdit/Index';
import { SinistroAddressEdit } from '../sinistroAddressEdit/Index';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { SinistrosSolicitacaoList } from '../SinistrosSolicitacaoList/SinistrosSolicitacaoList';
import { SinistrosUserList } from '../sinistrosUserList/Index';
import { MapaSinistros } from '../localization/MapaSinistros/MapaSinistros';
import { EstatisticasSinistros } from '../estatisticasSinistros/Index';
import { RequirePermission } from '../../Auth/RequirePermission';

export function Body(){
    return(
        <div className="body-container">
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/sobre" element={<About />} />
                <Route path="/cadastro" element={<SinistroForm />} />
                <Route path="/listaSinistros" element={<SinistrosList />}/>
                <Route path="/estatisticas" element={<RequirePermission claim="Sinistros" action="VI"><EstatisticasSinistros /></RequirePermission>} />
                <Route path="/mapaSinistros" element={<RequirePermission claim="Sinistros" action="VI"><MapaSinistros /></RequirePermission>} />
                <Route path="/sinistros/:id" element={<SinistroDetails />}/>
                <Route path="/sinistros/editar/:id" element={<SinistroEdit />}/>
                <Route path="/sinistros/editarEnderecoSinistro/:id" element={<SinistroAddressEdit />}/>
                <Route path="/sinistros/listaExclusaoSinistros" element={<SinistrosSolicitacaoList />}/>
                <Route path="/listaUserSinistros" element={<SinistrosUserList />}/>

                <Route path="*" element={<About />} />
            </Routes>
            
        </div>
    )
}