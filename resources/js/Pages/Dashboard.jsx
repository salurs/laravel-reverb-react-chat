import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Input } from "@headlessui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import ChatBubble from "@/Components/ChatBubble.jsx";
import Chat from "@/Components/Chat.jsx";

export default function Dashboard({ auth }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [activeChats, setActiveChats] = useState([]);

    useEffect(() => {
        axios.get('/users')
            .then(res => {
                setUsers(res.data);
                setFilteredUsers(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleSearch = (event) => {
        searchUsers(users, searchInput);

        console.log('search icon has clicked!')
    };

    const handleSearchInput = (event) => {
        setSearchInput(event.target.value);
        searchUsers(users, event.target.value);
    };

    const searchUsers = (users, key) => {
        const filtered =  users.filter(user => {
            return user.name.toLowerCase().includes(key.toLowerCase());
        });
        setFilteredUsers(filtered);
    };

    const startChat = (user) => {
        let chats = activeChats.filter(item => item.id === user.id);
        let openedChats = activeChats.filter(item => item.chat_status === 'open')
        let hasUser = openedChats.some(item => item.id === user.id)
        if (openedChats.length >= 3 && !hasUser) {
            let firstOpenChatIndex = activeChats.findIndex(item => item.chat_status === 'open');
            if (firstOpenChatIndex !== -1) {
                activeChats[firstOpenChatIndex].chat_status = 'hide';
            }
        }
        if (chats.length > 0) {
            let chat = chats[0];
            chat.chat_status = 'open';
            setActiveChats(activeChats.map(item => item.id === user.id ? chat : item));
        } else {
            user.chat_status = 'open';
            setActiveChats([...activeChats, user]);
        }
    }
    const removeChat = (user) => {
        let chats = activeChats.filter(item => item.id !== user.id)
        setActiveChats(chats);
    }
    const storeChat = (user) => {
        activeChats.map(item => {
            if (item.id === user.id)
                item.chat_status = 'hide';
        })
        setActiveChats(activeChats);
    }
    const openChat = (user) => {
        let openedChats = activeChats.filter(item => item.chat_status === 'open')
        if (openedChats.length >= 3) {
            let firstOpenChatIndex = activeChats.findIndex(item => item.chat_status === 'open');
            if (firstOpenChatIndex !== -1) {
                activeChats[firstOpenChatIndex].chat_status = 'hide';
            }
        }
        activeChats.map(item => {
            if (item.id === user.id)
                item.chat_status = 'open';
        })
        setActiveChats(activeChats);
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="w-72 height-screen overflow-y-auto overflow-x-hidden bg-gray-100 p-4 border relative float-end">
                <div className="w-full mb-4">
                    <div className="relative">
                        <Input className="rounded-lg pr-10"
                               placeholder="search"
                               value={searchInput}
                               onChange={handleSearchInput}
                        />
                        <FaSearch onClick={handleSearch} className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                    </div>
                </div>

                <ul>
                    {filteredUsers.map((user, index) => (
                        <li key={index} className="flex items-center mb-2">
                            <img onClick={() => startChat(user)} className="w-10 h-10 rounded-full mr-3 cursor-pointer" src={user.avatar} alt="Profile 1" />
                            <span onClick={() => startChat(user)} className="text-gray-800 cursor-pointer">{user.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div id="current-bubbles" className="absolute bottom-16 right-16">
                {
                    activeChats.length > 0 && (
                        activeChats.map((user) => user.chat_status === 'hide' && (
                            <ChatBubble user={user} key={user.id} removeChat={removeChat} openChat={openChat}/>
                        ))
                    )
                }
            </div>
            <div id="current-chats" className="absolute bottom-0 right-80 flex">
                {
                    activeChats.length > 0 && (
                        activeChats.map((user) => user.chat_status === 'open' && (
                            <Chat user={auth.user} friend={user} key={user.id} removeChat={removeChat} storeChat={storeChat} />
                        ))
                    )
                }
            </div>

        </AuthenticatedLayout>
    );
}
