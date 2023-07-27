<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\View;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Nette\Utils\Random;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    function __construct()
    {
        View::share('app_client_url', 'http://localhost:3000');
    }

    public function uploadBase64($encode, $path, $extension)
    {
        @mkdir(public_path('/assets'));
        @mkdir(public_path('/assets/' . $path));

        $file = explode(';base64,', $encode)[1];
        $filename = Random::generate(20) . '.' . $extension;
        $filepath = '/assets/' . $path . '/' . $filename;

        file_put_contents(public_path($filepath), base64_decode($file));
        return $filepath;
    }
}
