<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'username' => $this->username,
            'nama' => $this->nama,
            'alamat' => $this->alamat,
            'email' => $this->email,
            'telepon' => $this->telepon,
            'foto' => $this->foto,
            'foto' => asset($this->foto ?: 'assets/user/default.png'),
            'role' => $this->role,
            'role_detail' => [1 => 'Admin', 2 => 'User'][(int) $this->role],
            'status' => $this->status,
            'status_detail' => ['Nonaktif', 'Aktif'][(int) $this->status],
        ];
    }
}
