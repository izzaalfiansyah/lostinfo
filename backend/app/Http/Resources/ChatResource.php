<?php

namespace App\Http\Resources;

use App\Models\ChatDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
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
            'user_1_id' => $this->user_1_id,
            'user_2_id' => $this->user_2_id,
            'user_1' => new UserResource(User::find($this->user_1_id)),
            'user_2' => new UserResource(User::find($this->user_2_id)),
            'terbaru' => ChatDetail::where('chat_id', $this->id)->orderBy('created_at', 'desc')->first(),
        ];
    }
}
