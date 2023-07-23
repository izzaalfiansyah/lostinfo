<?php

namespace App\Http\Requests;

class UserLaporRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'user_id' => 'required|numeric',
            'pelapor_id' => 'required|numeric',
            'alasan' => 'required',
        ];
    }
}
