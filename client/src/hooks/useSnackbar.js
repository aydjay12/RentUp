import { useState, useCallback } from 'react';

export const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState({
        isOpen: false,
        message: '',
        type: 'info',
    });

    const showSnackbar = useCallback((message, type = 'info') => {
        setSnackbar({
            isOpen: true,
            message,
            type,
        });
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, isOpen: false }));
    }, []);

    return {
        snackbar,
        showSnackbar,
        hideSnackbar,
    };
};
