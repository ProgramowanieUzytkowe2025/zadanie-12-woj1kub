import './AppCalculator.css';
import { useState, useEffect, useReducer } from 'react';
import { AppButton } from './AppButton';
import { AppCalculationHistory } from './AppCalculationHistory';
import { useKalkulator } from './useKalkulator';
import { kalkulatorReducer, initialStatus } from './kalkulatorReducer';

export function AppCalculator() {

    function historiaDostepna() {
        try {
            return typeof sessionStorage !== 'undefined';
        } catch {
            return false;
        }
    }

    const [historia, setHistoria] = useState(() => {
        try {
            const raw = historiaDostepna() ? sessionStorage.getItem('kalkulator_historia') : null;
            const parsed = raw ? JSON.parse(raw) : null;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const [liczbaA, setLiczbaA] = useState(() => {
        try {
            const raw = historiaDostepna() ? sessionStorage.getItem('kalkulator_historia') : null;
            const parsed = raw ? JSON.parse(raw) : null;
            if (Array.isArray(parsed) && parsed.length) return parsed[parsed.length - 1].a;
        } catch {
            // ignoruj
        }
        return null;
    });

    const [liczbaB, setLiczbaB] = useState(() => {
        try {
            const raw = historiaDostepna() ? sessionStorage.getItem('kalkulator_historia') : null;
            const parsed = raw ? JSON.parse(raw) : null;
            if (Array.isArray(parsed) && parsed.length) return parsed[parsed.length - 1].b;
        } catch {
            // ignoruj
        }
        return null;
    });
    const [wynik, setWynik] = useState(null);

    const { dodaj, odejmij, pomnoz, podziel } = useKalkulator({ liczbaA, liczbaB, historia, setHistoria, setWynik });

    const [ostatniaAkcja, dispatchOstatniaAkcja] = useReducer(kalkulatorReducer, initialStatus);

    function liczbaAOnChange(value) {
        setLiczbaA(parsujLiczbe(value));
        dispatchOstatniaAkcja({ type: 'CHANGE_A' });
    }

    function parsujLiczbe(value) {
        const sparsowanaLiczba = parseFloat(value);
        if(isNaN(sparsowanaLiczba)) {
            return null;
        } else {
            return sparsowanaLiczba;
        } 
    }

    function liczbaBOnChange(value) {
        setLiczbaB(parsujLiczbe(value));
        dispatchOstatniaAkcja({ type: 'CHANGE_B' });
    }

    function onAppCalculationHistoryClick(index) {
        const nowaHistoria = historia.slice(0, index + 1);
        setHistoria(nowaHistoria);
        setLiczbaA(historia[index].a);
        setLiczbaB(historia[index].b);
        setWynik(historia[index].wynik);
        dispatchOstatniaAkcja({ type: 'RESTORE' });
    }


    useEffect(() => {
        try {
            if (historiaDostepna()) sessionStorage.setItem('kalkulator_historia', JSON.stringify(historia));
        } catch {
            // ignorowanie błędów zapisu do sessionStorage
        }
    }, [historia]);

    const zablokujPrzyciski = liczbaA == null || liczbaB == null;
    const zablokujDzielenie = zablokujPrzyciski || liczbaB === 0;
    const [porownanie, setPorownanie] = useState('');


    useEffect(() => {
        let nowePorownanie = '';

        if (!zablokujPrzyciski) {
            if (liczbaA === liczbaB) {
                nowePorownanie = 'Liczba A jest równa liczbie B.';
            } else if (liczbaA > liczbaB) {
                nowePorownanie = 'Liczba A jest większa od liczby B.';
            } else {
                nowePorownanie = 'Liczba B jest większa od liczby A.';
            }
        }

        if (nowePorownanie !== porownanie) {
            setPorownanie(nowePorownanie);
        }
    }, [liczbaA, liczbaB, zablokujPrzyciski, porownanie]);

    return (
    <div className='app-calculator'>
        <div className='app-calculator-pole'>
            <label>Wynik: </label>
            <span>{wynik}</span>
        </div>

        <hr />

        <div className='app-calculator-pole'>
            <label>Ostatnia czynność: </label>
            <input type="text" value={ostatniaAkcja} readOnly />
        </div>

        <hr />

        <div className='app-calculator-pole'>
            <label>Dynamiczne porównanie liczb: </label>
            <span>{porownanie}</span>
        </div>

        <hr />

        <div className='app-calculator-pole'>
            <label htmlFor="liczba1">Liczba 1</label>
            <input id="liczba1" type="number" value={liczbaA} onChange={(e) => liczbaAOnChange(e.target.value)} name="liczba1" />
        </div>
        <div className='app-calculator-pole'>
            <label htmlFor="liczba2">Liczba 2</label>
            <input id="liczba2" type="number" value={liczbaB} onChange={(e) => liczbaBOnChange(e.target.value)} name="liczba2" />
        </div>

        <hr />

        <div className='app-calculator-przyciski'>
            <AppButton disabled={zablokujPrzyciski} title="+" onClick={() => { dodaj(); dispatchOstatniaAkcja({ type: 'CALC' }); }} />
            <AppButton disabled={zablokujPrzyciski} title="-" onClick={() => { odejmij(); dispatchOstatniaAkcja({ type: 'CALC' }); }} />
            <AppButton disabled={zablokujPrzyciski} title="*" onClick={() => { pomnoz(); dispatchOstatniaAkcja({ type: 'CALC' }); }} />
            <AppButton disabled={zablokujDzielenie} title="/" onClick={() => { podziel(); dispatchOstatniaAkcja({ type: 'CALC' }); }} />
        </div>

        <hr />
        
        <div className='app-calculator-historia'>
            <AppCalculationHistory historia={historia} onClick={(index) => onAppCalculationHistoryClick(index)}/>
        </div>
    </div>)
}