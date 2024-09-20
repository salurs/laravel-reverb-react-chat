import {FaTimes} from "react-icons/fa";

export default function ChatBubble({user, removeChat, openChat}) {
    return (
        <ul>
            <li className="flex items-center mb-2 cursor-pointer relative">
                <img onClick={() => openChat(user)} className="w-10 h-10 rounded-full mr-3" src={user.avatar} alt="Profile 1"/>
                <FaTimes onClick={() => removeChat(user)} className="absolute -right-2 -top-2  text-gray-500 cursor-pointer" />
            </li>
        </ul>
    );
}
