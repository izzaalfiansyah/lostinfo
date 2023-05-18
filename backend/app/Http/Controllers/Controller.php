<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Nette\Utils\Random;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function uploadBase64($encode, $path, $extension)
    {
        $file = explode(';base64,', $encode)[1];
        $filename = Random::generate(20) . '.' . $extension;
        $filepath = $path . '/' . $filename;

        file_put_contents(public_path($filepath), base64_decode($file));
        return $filepath;
    }
}
