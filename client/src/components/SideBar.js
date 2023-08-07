/* eslint-disable no-unused-vars */
import React from 'react'
import UserCard from './UserCard'
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Typography, Divider, Stack } from '@mui/material'

const SideBar = ({ setLoggedIn }) => {
    const { loading, data, error } = useQuery(GET_ALL_USERS)
    if (loading) {
        return <Typography variant='h6'>Loading Chats</Typography>
    }
    if (error) {
        console.log(error.message)
    }
    // console.log(data)
    return (
        <Box
            backgroundColor="#f7f7f7"
            height="100vh"
            width="250px"
            padding="10px"
        >
            <Stack
                direction="row"
                justifyContent="space-between"
            >
                <Typography variant='h6'>Chat</Typography>
                <LogoutIcon sx={{cursor:'grab'}} onClick={() => {
                    localStorage.removeItem('jwt')
                    setLoggedIn(false)
                }} />
            </Stack>

            <Divider />
            {
                data.users.map(item => {
                    return <UserCard key={item.id} item={item} />
                })
            }
        </Box>
    )
}

export default SideBar
