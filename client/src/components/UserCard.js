import React from 'react'
import { Stack, Avatar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const UserCard = ({ item: { id, FirstName, LastName } }) => {
    const navigate = useNavigate()
    return (
        <Stack
            className='usercard'
            direction="row"
            spacing={2}
            sx={{ py: 1 }} // py is for applying padding in the y direction
            onClick={() => navigate(`/${id}/${FirstName} ${LastName}`)}
        >
            <Avatar
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${FirstName} ${LastName}`}
                sx={{ width: "32px", height: "32px" }}
            />
            <Typography variant='subtitle2'>{FirstName} {LastName}</Typography>
        </Stack>
    )
}

export default UserCard
