<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserLaporResource extends JsonResource
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
            'pelapor_id' => $this->pelapor_id,
            'alasan' => $this->alasan,
            'user' => new UserResource(User::find($this->user_id)),
            'pelapor' => new UserResource(User::find($this->pelapor_id)),
        ];
    }
}
