import './Index.css'
import { Navbar } from './Navbar/Index.tsx'

export function Header(){
    return(
        <div className='header'>
            <div className="header-content">
                <div className='title'>
                <img
                    className="logo"
                    src="/src/assets/img/InfoTrânsitoLogo.png"
                    alt="Logo InfoTânsito"
                />
                <div className='nameText'>
                    <h1 className='sitemTitle'>InfoTrânsito</h1>
                    <h3 className='sistemDescripton'>Reporte de Sinistros de Trânsito</h3>
                </div>
            </div>
            

            </div>
            
            <Navbar />
        </div>
    )
}