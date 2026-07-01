import { Provider } from 'react-redux';
import { store } from './store';
import AppRouter from './routes/AppRouter';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <AppRouter />
      </LanguageProvider>
    </Provider>
  );
}
