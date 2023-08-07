/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Toolbar, Avatar, TextField, Button } from '@mui/material'
import MessageCard from './MessageCard';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { GET_MSG } from '../graphql/queries';
import SendIcon from '@mui/icons-material/Send'
import { Stack } from '@mui/material';
import { SEND_MESSAGE } from '../graphql/mutations';
import { MSG_SUB } from '../graphql/subscriptions';
import jwt_decode from 'jwt-decode'

const ChatScreen = () => {
    const { id, name } = useParams()
    const [text, setText] = useState("")
    const [messages, setMessages] = useState([])
    const { userId } = jwt_decode(localStorage.getItem('jwt'))
    const { data, loading, error } = useQuery(GET_MSG, {
        variables: {
            receiverId: +id
        },
        onCompleted(data) {
            setMessages(data.showMessageByUser)
        }
    })

    const [sendMessage] = useMutation(SEND_MESSAGE, {
        onCompleted(data) {
            setMessages((prevMessages) => [...prevMessages, data.createMessage])
        }
    })
    const { data: subData } = useSubscription(MSG_SUB, {
        onSubscriptionData({ subscriptionData: { data } }) {
            if ((data.messageAdded.receiverId === +id && data.messageAdded.senderId === userId) ||
                (data.messageAdded.receiverId === userId && data.messageAdded.senderId === +id)
            ) {
                setMessages((prevMessages) => [...prevMessages, data.messageAdded])
            }
        }
    })

    if (error) {
        console.log(error.message)
    }


    return (
        <Box
            flexGrow={1}
        >
            <Toolbar>
                <Avatar
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
                    sx={{ width: "32px", height: "32px", mr: 2 }}
                />
                <Typography variant='h6' color="black" >{name}</Typography>
            </Toolbar>
            <Box backgroundColor="#f5f5f5" height="80vh" padding="10px" sx={{ overflowY: "auto" }}>
                {
                    loading ? <Typography variant='h6'>Loading Chats</Typography>
                        : messages.map(msg => {
                            return <MessageCard key={msg.CreatedAt} Text={msg.Text} date={msg.CreatedAt} direction={msg.ReceiverId === +id ? "end" : "start"}></MessageCard>
                        })
                }

            </Box>
            <Stack direction="row" >
                <TextField
                    // className='inputMsg'
                    placeholder='Enter a Message'
                    variant='standard'
                    fullWidth
                    multiline
                    rows={2}
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                {/* <Button  size='small' variant="outlined" endIcon={<SendIcon />} onClick={() => {
                    sendMessage({
                        variables: {
                            receiverId: +id,
                            text: text
                        }
                    })
                }}>
                    Send
                </Button> */}
                <SendIcon backgroundColor="#ffffff" sx={{ padding: "10px" }} fontSize='large' onClick={() => {
                    sendMessage({
                        variables: {
                            receiverId: +id,
                            text: text
                        }
                    })
                }} />
            </Stack>
        </Box>
    )
}

export default ChatScreen
