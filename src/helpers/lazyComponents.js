import { Suspense } from 'react';
import ErrorHandler from '../components/atomic/ErrorHandler';
import LazySpinner from '../components/atomic/LazySpinner';


export default function LazyComponent({ children }) {
  return (
    <ErrorHandler>
      <Suspense fallback={<LazySpinner />}>
        {children}
      </Suspense>
    </ErrorHandler>
  );
};
