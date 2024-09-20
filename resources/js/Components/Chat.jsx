import {FaCamera, FaMinus, FaPhone, FaTimes} from "react-icons/fa";
import {Input} from "@headlessui/react";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {IoIosSend} from "react-icons/io";


export default function Chat({user, friend, removeChat, storeChat}) {
    const chatBoxRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                let res = await axios.get(`/messages/${friend.id}`);
                setMessages(res.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages().then(() => {
            if (chatBoxRef.current) {
                setTimeout(() => {
                    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                }, 0);
            }
        });
    }, []);

    useEffect(() => {

        const channelName = `chat.${Math.min(friend.id, user.id)}_${Math.max(friend.id, user.id)}`;
        const channel = window.Echo.private(channelName)
            .listen('SentMessage', (e) => {
                if(e.sender !== user.id){
                    console.log('massage taken')
                }else{
                    console.log('message sent')
                }
                setMessages([...messages, e]);
                if (chatBoxRef.current) {
                    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                }
            });

        return () => {
            channel.stopListening('SentMessage');
            window.Echo.leave(channelName);
        }
    }, [messages]);
    const handleSendMessage =  async () => {
        if (newMessage.trim() !== '') {
            // setMessages([...messages, newMessage])
            setNewMessage('');
            const  msg = {
                sender_id : user.id,
                receiver_id: friend.id,
                message: newMessage
            }
            const res = await axios.post('/messages', msg);
            if(res.status)
                setMessages([...messages, msg])
        }
    };
    return (
        <div className="relative ml-3 bg-gray-100" style={{width: '340px', height: '450px', border: '1px solid #ddd'}}>
            <div className="toolbar p-3 border-b-2">
                <div className="flex justify-between">
                    <div className="user flex justify-center items-center">
                        <img className="w-10 h-10 rounded-full mr-3" src={friend.avatar} alt="Profile 1"/>
                        <span>{friend.name}</span>
                    </div>
                    <div className="tools">
                        <ul className="flex">
                            <li className="p-2">
                                <FaPhone/>
                            </li>
                            <li className="p-2">
                                <FaCamera/>
                            </li>
                            <li onClick={() => storeChat(friend)} className="p-2 cursor-pointer">
                                <FaMinus/>
                            </li>
                            <li onClick={() => removeChat(friend)} className="p-2 cursor-pointer">
                                <FaTimes/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="wrapper">
                <div className="content p-5 overflow-y-auto mb-5" style={{height: '296px'}} ref={chatBoxRef}>
                    <div className="text-center">
                        <div className="flex justify-center mb-2">
                            <img className="w-10 h-10 rounded-full mr-3" src={friend.avatar}
                                 alt="Profile 1"/>
                        </div>
                        <div className="font-bold">{friend.name}</div>
                        <div className="chat-box mt-5 mb-5">
                            {messages.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.sender_id === user.id ? (
                                        <div className="flex justify-end">
                                            <span className="rounded-xl bg-green-700 p-2 float-right mb-2 message-width">
                                                {item.message}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-start">
                                            <span className="rounded-xl bg-gray-500 p-2 float-left mb-2 message-width">
                                                {item.message}
                                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                    </div>
                    </div>
                </div>
                <div className="search flex justify-center items-center border-t">
                <Input className="rounded-full w-3/4 mt-3 mb-3"
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                               handleSendMessage();
                           }
                       }}
                       autoComplete="off"
                />
                <IoIosSend onClick={handleSendMessage} className="cursor-pointer" style={{width: '30px', height: '30px', marginLeft: '15px'}} />
                </div>
            </div>
        </div>
    );
}



