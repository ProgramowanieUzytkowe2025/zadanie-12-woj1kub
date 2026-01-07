import './AppHeader.css';
import { useFont } from './FontProvider';

export function AppHeader({imie, nazwisko}) {
    const czcionki = ['small', 'medium', 'large'];
    const { setFont } = useFont();

    return (
        <div className="app-header">
            <h2>{imie} {nazwisko}</h2>
            <div className="app-header-czcionki">
                {czcionki.map(c => (<span key={c} title={c} onClick={() => setFont(c)} style={{ fontSize: c }}>A</span>))}
            </div>
        </div>
    );
}