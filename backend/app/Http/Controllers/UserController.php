<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

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

        $item = User::create($data);

        return new UserResource($item);
    }

    public function update(UserRequest $req, $id)
    {
        $data = $req->validated();

        $item = User::find($id);
        $item?->update($data);

        return new UserResource($item);
    }

    public function destroy($id)
    {
        $item = User::find($id);
        $item?->delete();

        return new UserResource($item);
    }
}
