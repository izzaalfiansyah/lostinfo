<?php

namespace App\Http\Requests;

use App\Rules\Base64;

class BarangHilangRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'user_id' => 'required|integer',
            'nama' => 'required|max:255',
            'deskripsi' => 'nullable',
            'tempat_hilang' => 'required|max:255',
            'maps' => 'nullable',
            'maps.lat' => 'required_with:maps',
            'maps.lng' => 'required_with:maps',
            'foto' => ['nullable', new Base64()],
            'hadiah' => 'required',
            'ditemukan' => 'nullable|string|in:1,0',
        ];
    }
}
