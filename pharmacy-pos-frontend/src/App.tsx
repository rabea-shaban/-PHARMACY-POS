import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/index.js';
import { queryClient } from './lib/queryClient.js';
import { AppRoutes } from './routes/AppRoutes.js';
import { UpdateModal } from './components/common/UpdateModal.js';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AppRoutes />
          <UpdateModal />
        </HashRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
