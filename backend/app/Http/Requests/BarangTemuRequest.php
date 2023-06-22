<?php

namespace App\Http\Requests;

use App\Rules\Base64;

class BarangTemuRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|integer',
            'nama' => 'required|max:255',
            'deskripsi' => 'nullable',
            'tempat_temu' => 'required|max:255',
            'maps' => 'nullable',
            'maps.lat' => 'required_with:maps',
            'maps.lng' => 'required_with:maps',
            'foto' => ['nullable', new Base64()],
            'dikembalikan' => 'nullable|in:1,0',
        ];
    }
}
