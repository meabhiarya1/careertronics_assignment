import axios from 'axios';
import { useEffect, useState } from 'react';
import { batchService } from '../services/batchService.js';

// Loads the centre names once, for the "All Centres" dropdown.
export function useCentres() {
  const [centres, setCentres] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    batchService
      .getCentres(controller.signal)
      .then(setCentres)
      .catch((err) => {
        if (!axios.isCancel(err)) console.error('Failed to load centres', err);
      });

    return () => controller.abort();
  }, []);

  return centres;
}
