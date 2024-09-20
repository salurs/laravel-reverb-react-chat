<?php

namespace App\Broadcasting;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatOneToOne
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $sender, User $receiver): array|bool
    {
//        return false;
        return Auth::check() && (Auth::id() === $sender->id || Auth::id() === $receiver->id);
    }
}
