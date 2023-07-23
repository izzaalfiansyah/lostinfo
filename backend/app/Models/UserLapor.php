<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLapor extends Model
{
    use HasFactory;

    public $table = 'user_lapor';

    public $fillable = [
        'user_id',
        'pelapor_id',
        'alasan',
    ];
}
