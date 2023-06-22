<?php

namespace App\Http\Requests;

class ChatRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'user_1_id' => 'required|integer',
            'user_2_id' => 'required|integer',
        ];
    }
}
