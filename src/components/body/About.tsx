import './Index.css'

export function About(){
    return(
        <div className="about-container">
            <h1>Sobre o InfoTrânsito</h1>

            <p>
                O <strong>InfoTrânsito</strong> é um sistema online desenvolvido para facilitar o
                <strong> registro de sinistros de trânsito sem vítimas</strong>.
                Ele permite que motoristas, empresas e cidadãos comuniquem rapidamente às autoridades competentes
                a ocorrência de acidentes que não resultaram em feridos.
            </p>

            <p>
                Essa comunicação é <strong>fundamental</strong> por dois motivos principais:
            </p>

            <ol>
                <li>
                    <strong>Cumprimento da legislação:</strong> A lei determina que sinistros de trânsito,
                    mesmo sem vítimas, sejam comunicados aos órgãos responsáveis. O InfoTrânsito oferece um
                    meio simples, rápido e acessível para cumprir essa exigência, evitando burocracias desnecessárias.
                </li>
                <li>
                    <strong>Geração de dados para prevenção:</strong> Cada registro enviado contribui para a
                    construção de um <strong>banco de dados atualizado</strong> sobre os acidentes que ocorrem
                    na cidade ou região. Essas informações permitem que as autoridades de trânsito identifiquem
                    padrões, pontos críticos e causas frequentes, possibilitando o desenvolvimento de
                    <strong> ações preventivas e de melhoria da segurança viária</strong>.
                </li>
            </ol>

            <p>
                Com o InfoTrânsito, o processo de notificação se torna <strong>prático, seguro e eficiente</strong>,
                beneficiando tanto os cidadãos quanto o poder público, e ajudando a tornar o trânsito mais seguro para todos.
            </p>
        </div>
    )
}