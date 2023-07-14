<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BarangHilangResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource(User::find($this->user_id)),
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'tempat_hilang' => $this->tempat_hilang,
            'maps' => $this->maps,
            'foto' => $this->foto,
            'foto_url' => asset($this->foto ?: '/assets/barang_default.jpg'),
            'hadiah' => $this->hadiah,
            'ditemukan' => $this->ditemukan,
            'ditemukan_detail' => ['Belum', 'Sudah'][(int) $this->ditemukan],
        ];
    }
}
