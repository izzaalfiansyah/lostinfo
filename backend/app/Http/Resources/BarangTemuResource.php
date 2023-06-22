<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BarangTemuResource extends JsonResource
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
            'user_id' => (int) $this->user_id,
            'user' => new UserResource(User::find($this->user_id)),
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'tempat_temu' => $this->tempat_temu,
            'maps' => $this->maps,
            'foto' => $this->foto,
            'foto_url' => asset($this->foto ?: '/assets/barang_default.jpg'),
            'dikembalikan' => (int) $this->dikembalikan,
            'dikembalikan_detail' => ['Belum', 'Sudah'][(int) $this->dikembalikan],
        ];
    }
}
