import { Stack, Typography } from '@mui/material'
import React from 'react'

const Welcome = () => {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
        >
            <Typography variant="h2">Welcome to Teams</Typography>
        </Stack>
    )
}

export default Welcome
