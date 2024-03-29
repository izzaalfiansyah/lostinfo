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
            'maps_lat' => 'required_with:maps_lng',
            'maps_lng' => 'required_with:maps_lat',
            'foto' => ['nullable', new Base64()],
            'hadiah' => 'required',
            'ditemukan' => 'nullable|in:1,0',
        ];
    }
}
