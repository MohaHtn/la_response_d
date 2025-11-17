import React from 'react';
import ModeratorValidationTable from '../components/ModeratorValidationTable';
import Header from '../components/Header';
import { Box } from '@mui/material';

function ModeratorPage() {
    return (
        <div>
            <Header />
            <Box sx={{ paddingTop: '64px' }}>
                <ModeratorValidationTable />
            </Box>
        </div>
    );
}

export default ModeratorPage;