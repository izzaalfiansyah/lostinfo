<?php

namespace App\Http\Requests;


class UserRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|max:255',
            'password' => 'required|max:255|min:8',
            'alamat' => 'required',
            'email' => 'required|email',
            'telepon' => 'required|numeric',
            'foto' => 'nullable',
            'role' => 'required|in:1,2',
            'status' => 'required|in:1,0',
        ];
    }
}
