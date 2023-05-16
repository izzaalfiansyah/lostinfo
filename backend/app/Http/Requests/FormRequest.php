<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as BaseFormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Response;

class FormRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function failedValidation($validator)
    {
        $response = Response::json([
            'data' => $validator->errors(),
            'message' => $validator->errors()->all(),
        ]);
        throw new HttpResponseException($response, 400);
    }
}
