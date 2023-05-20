<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $items = User::all();

        return UserResource::collection($items);
    }

    public function store(UserRequest $req)
    {
        $data = $req->validated();

        $data['password'] = Hash::make($req->password);

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'user', 'png');
        }

        $item = User::create($data);

        return new UserResource($item);
    }

    public function update(UserRequest $req, $id)
    {
        $data = $req->validated();

        $item = User::find($id);

        if ($req->password) {
            $data['password'] = Hash::make($req->password);
        } else {
            unset($data['password']);
        }

        if ($req->foto) {
            $data['foto'] = $this->uploadBase64($req->foto, 'user', 'png');
            @unlink(public_path('/assets/user/' . $item->foto));
        } else {
            unset($data['foto']);
        }

        $item?->update($data);

        return new UserResource($item);
    }

    public function destroy($id)
    {
        $item = User::find($id);

        @unlink(public_path('/assets/user/' . $item->foto));

        $item?->delete();

        return new UserResource($item);
    }

    public function login(Request $req)
    {
        $schema = Validator::make($req->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($schema->fails()) {
            return Response([
                'data' => $schema->errors(),
                'message' => $schema->errors()->all(),
            ], 400);
        }

        $items = User::where('username', $req->username)->get();

        if (count($items) > 0) {
            foreach ($items as $key => $item) {
                if (Hash::check($req->password, $item->password)) {
                    return new UserResource($item);
                }
            }

            return Response([
                'data' => [],
                'message' => ['password salah'],
            ]);
        } else {
            return Response([
                'data' => [],
                'message' => ['username tidak ditemukan'],
            ], 400);
        }
    }
}
