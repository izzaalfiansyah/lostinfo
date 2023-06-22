<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangTemu extends Model
{
    use HasFactory;

    public $table = 'barang_temu';

    public $fillable = [
        'user_id',
        'nama',
        'deskripsi',
        'tempat_temu',
        'maps',
        'foto',
        'dikembalikan',
    ];

    public $casts = [
        'maps' => 'object',
    ];
}
