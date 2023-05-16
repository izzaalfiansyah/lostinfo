<?php

namespace App\Http\Requests;

use App\Rules\Base64;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $id = $this->segment(1);

        return [
            'username' => 'required|max:255',
            'password' => [$id ? 'nullable' : 'required', Password::min(8)],
            'alamat' => 'required',
            'email' => 'required|email',
            'telepon' => 'required|numeric',
            'foto' => ['nullable', new Base64],
            'role' => 'required|in:1,2',
            'status' => 'required|in:1,0',
        ];
    }
}
