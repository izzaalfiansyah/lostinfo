<?php

namespace App\Http\Resources;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $chat = Chat::find($this->chat_id);

        if ($this->pengirim == '1') {
            $pengirim_id = $chat->user_1_id;
        } else {
            $pengirim_id = $chat->user_2_id;
        }

        return [
            'id' => $this->id,
            'chat_id' => $this->chat_id,
            'chat' => new ChatResource($chat),
            'pesan' => $this->pesan,
            'maps' => $this->maps,
            'foto' => $this->foto,
            'foto_url' => $this->foto ? asset($this->foto) : '',
            'pengirim' => $this->pengirim,
            'pengirim_id' => $pengirim_id,
            'dibaca' => (int) $this->dibaca,
            'dibaca_detail' => ['Belum', 'Sudah'][(int) $this->dibaca],
        ];
    }
}
