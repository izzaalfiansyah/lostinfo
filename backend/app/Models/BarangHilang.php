<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangHilang extends Model
{
    use HasFactory;

    public $table = 'barang_hilang';

    public $fillable = [
        'user_id',
        'nama',
        'deskripsi',
        'tempat_hilang',
        'maps',
        'foto',
        'hadiah',
        'ditemukan',
    ];

    public $cast = [
        'maps' => 'object',
    ];
}
