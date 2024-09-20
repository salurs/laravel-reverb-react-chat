<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

//Broadcast::channel('chat.{sender}.{receiver}', function (User $sender, User $receiver) {
//    return Auth::check() && (Auth::id() === $sender->id || Auth::id() === $receiver->id);
//});

//Broadcast::channel('chat.{sender}.{receiver}', function (User $sender, User $receiver) {
//    $channelName = min($sender->id, $receiver->id) . "_" . max($sender->id, $receiver->id);
//    return $channelName;
//});

Broadcast::channel('chat.{sender}.{receiver}', 'App\Broadcasting\ChatOneToOne');
Broadcast::channel('group-chat.{groupId}', 'App\Broadcasting\ChatGroup');

