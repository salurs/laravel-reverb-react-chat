<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
    ];

    public function sender(): Relation
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function receiver(): Relation
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

}
