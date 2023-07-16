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
        $ktp_url = '';

        if ($this->ktp) {
            $ktp_file = file_get_contents(public_path($this->ktp));
            $ktp_url = 'data:image/png;base64,' . base64_encode($ktp_file);
        }

        return [
            'id' => $this->id,
            'username' => $this->username,
            'nama' => $this->nama,
            'alamat' => $this->alamat,
            'email' => $this->email,
            'telepon' => $this->telepon,
            'foto' => $this->foto,
            'foto_url' => asset($this->foto ?: 'assets/user_default.png'),
            'ktp' => $this->ktp,
            'ktp_url' => $ktp_url,
            'role' => $this->role,
            'role_detail' => [1 => 'Admin', 2 => 'User'][(int) $this->role],
            'status' => $this->status,
            'status_detail' => [0 => 'Nonaktif', 1 => 'Aktif', 9 => 'Banned'][(int) $this->status],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
