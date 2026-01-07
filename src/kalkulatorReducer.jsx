export const initialStatus = 'Brak';

export function kalkulatorReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_A':
      return 'Zmodyfikowano wartość liczby A';
    case 'CHANGE_B':
      return 'Zmodyfikowano wartość liczby B';
    case 'CALC':
      return 'Wykonano obliczenia';
    case 'RESTORE':
      return 'Przywrócono historyczny stan';
    case 'RESET':
      return initialStatus;
    default:
      return state;
  }
}
