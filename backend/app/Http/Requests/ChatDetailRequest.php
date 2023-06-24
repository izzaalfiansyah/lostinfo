<?php

namespace App\Http\Requests;

use App\Rules\Base64;

class ChatDetailRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'chat_id' => 'required|integer',
            'pesan' => 'nullable',
            'maps' => 'nullable',
            'maps.lat' => 'required_with|maps',
            'maps.lng' => 'required_with|maps',
            'foto' => ['nullable', new Base64],
            'pengirim' => 'required|in:1,2',
            'dibaca' => 'nullable|in:1,0'
        ];
    }
}
