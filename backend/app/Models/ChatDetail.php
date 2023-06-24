<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatDetail extends Model
{
    use HasFactory;

    public $table = 'chat_detail';

    public $fillable = [
        'chat_id',
        'pesan',
        'maps',
        'foto',
        'pengirim',
        'dibaca',
    ];

    public $casts = [
        'maps' =>  'object'
    ];
}
