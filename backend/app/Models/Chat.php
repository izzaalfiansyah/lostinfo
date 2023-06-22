<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    public $table = 'chat';

    public $fillable = [
        'user_1_id',
        'user_2_id',
    ];
}
