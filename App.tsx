import React, { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import {initMetaSdk} from './src/services/metaSdk';

export default function App() {
  useEffect(() => {
    initMetaSdk();
  }, []);
  return <RootNavigator />;
}