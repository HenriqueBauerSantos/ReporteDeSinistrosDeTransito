import "./Index.css"

type LoadingMessageProps = {
    message?: string
}

export const LoadingMessage = ({message = "Carregando..."}: LoadingMessageProps) => {
    return(
        <div className="loading-container">
            <div className="loading-spinner"/>
            <p className="loading-text">{message}</p>
        </div>
    );
};
    
